"""Backend API tests for Il Pescematto (auth + settings endpoints)."""
import os
import time

import pytest
import requests

BASE_URL = os.environ.get("EXPO_PUBLIC_BACKEND_URL", "http://localhost:8001").rstrip("/")

ADMIN_USER = os.environ.get("TEST_ADMIN_USER", "")
ADMIN_PASS = os.environ.get("TEST_ADMIN_PASS", "")

if not ADMIN_USER or not ADMIN_PASS:
    pytest.skip(
        "Set TEST_ADMIN_USER / TEST_ADMIN_PASS env vars to run these tests.",
        allow_module_level=True,
    )


@pytest.fixture(scope="module")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def token(api):
    r = api.post(
        f"{BASE_URL}/api/auth/login",
        json={"username": ADMIN_USER, "password": ADMIN_PASS},
        timeout=15,
    )
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    data = r.json()
    assert "access_token" in data
    assert data.get("token_type") == "bearer"
    assert isinstance(data.get("expires_in"), int) and data["expires_in"] > 0
    return data["access_token"]


# ---------- Auth ----------
class TestAuth:
    def test_login_success(self, api):
        r = api.post(
            f"{BASE_URL}/api/auth/login",
            json={"username": ADMIN_USER, "password": ADMIN_PASS},
            timeout=15,
        )
        assert r.status_code == 200
        j = r.json()
        assert j["access_token"] and j["token_type"] == "bearer"
        # 12h in seconds
        assert j["expires_in"] == 12 * 3600

    def test_login_wrong_password(self, api):
        r = api.post(
            f"{BASE_URL}/api/auth/login",
            json={"username": ADMIN_USER, "password": "wrong"},
            timeout=15,
        )
        assert r.status_code == 401

    def test_login_wrong_username(self, api):
        r = api.post(
            f"{BASE_URL}/api/auth/login",
            json={"username": "nope", "password": ADMIN_PASS},
            timeout=15,
        )
        assert r.status_code == 401


# ---------- Public settings ----------
class TestPublicSettings:
    def test_get_phone_public(self, api):
        r = api.get(f"{BASE_URL}/api/settings/phone", timeout=15)
        assert r.status_code == 200
        assert "phone" in r.json()

    def test_get_menu_public(self, api):
        r = api.get(f"{BASE_URL}/api/settings/menu", timeout=15)
        assert r.status_code == 200
        assert "menu" in r.json()


# ---------- Auth-protected settings ----------
class TestPhoneProtected:
    def test_put_phone_without_token(self, api):
        r = api.put(
            f"{BASE_URL}/api/settings/phone",
            json={"phone": "0183754557"},
            timeout=15,
        )
        assert r.status_code in (401, 403)

    def test_put_phone_bad_token(self, api):
        r = api.put(
            f"{BASE_URL}/api/settings/phone",
            json={"phone": "0183754557"},
            headers={"Authorization": "Bearer garbage"},
            timeout=15,
        )
        assert r.status_code == 401

    def test_put_phone_and_verify_persisted(self, api, token):
        marker = f"018375{int(time.time()) % 10000:04d}"
        r = api.put(
            f"{BASE_URL}/api/settings/phone",
            json={"phone": marker},
            headers={"Authorization": f"Bearer {token}"},
            timeout=15,
        )
        assert r.status_code == 200
        assert r.json()["phone"] == marker

        g = api.get(f"{BASE_URL}/api/settings/phone", timeout=15)
        assert g.status_code == 200
        assert g.json()["phone"] == marker


DEFAULT_TEST_MENU = [
    {
        "id": "primi",
        "name": "TEST_Primi",
        "items": [
            {"name": "TEST_Spaghetti", "description": "test", "price": 12.5, "allergens": [1, 3]}
        ],
    }
]


class TestMenuProtected:
    def test_put_menu_without_token(self, api):
        r = api.put(
            f"{BASE_URL}/api/settings/menu",
            json={"menu": DEFAULT_TEST_MENU},
            timeout=15,
        )
        assert r.status_code in (401, 403)

    def test_put_menu_and_verify_persisted(self, api, token):
        marker_name = f"TEST_Item_{int(time.time())}"
        payload = [
            {
                "id": "test-cat",
                "name": "TEST_Category",
                "items": [{"name": marker_name, "price": 9.9, "allergens": [1]}],
            }
        ]
        r = api.put(
            f"{BASE_URL}/api/settings/menu",
            json={"menu": payload},
            headers={"Authorization": f"Bearer {token}"},
            timeout=15,
        )
        assert r.status_code == 200
        got = r.json()["menu"]
        assert got and got[0]["items"][0]["name"] == marker_name

        g = api.get(f"{BASE_URL}/api/settings/menu", timeout=15)
        assert g.status_code == 200
        gm = g.json()["menu"]
        assert gm and gm[0]["items"][0]["name"] == marker_name

    def test_delete_menu_without_token(self, api):
        r = api.delete(f"{BASE_URL}/api/settings/menu", timeout=15)
        assert r.status_code in (401, 403)

    def test_delete_menu_resets(self, api, token):
        # first ensure something is stored
        api.put(
            f"{BASE_URL}/api/settings/menu",
            json={"menu": DEFAULT_TEST_MENU},
            headers={"Authorization": f"Bearer {token}"},
            timeout=15,
        )
        r = api.delete(
            f"{BASE_URL}/api/settings/menu",
            headers={"Authorization": f"Bearer {token}"},
            timeout=15,
        )
        assert r.status_code == 200
        # After delete public GET should return menu=None
        g = api.get(f"{BASE_URL}/api/settings/menu", timeout=15)
        assert g.status_code == 200
        assert g.json()["menu"] in (None, [])
