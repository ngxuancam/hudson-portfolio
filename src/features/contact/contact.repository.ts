export type ContactPayload = {
  name: string;
  email: string;
  company?: string;
  message: string;
};

export async function submitContact(payload: ContactPayload) {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok || !data?.ok) throw new Error(data?.error || "Submit failed");
  return true;
}
