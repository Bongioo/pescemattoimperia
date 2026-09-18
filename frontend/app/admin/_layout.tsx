import { Stack } from "expo-router";

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#05080F" },
        animation: "slide_from_right",
      }}
    />
  );
}
