import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitContact } from "../../features/contact/contact.repository";
import { useState } from "react";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Invalid email"),
  company: z.string().optional(),
  message: z.string().min(5, "Please enter your message"),
});

type FormValues = z.infer<typeof schema>;

export default function ContactForm() {
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await submitContact(values);
      setDone(true);
      reset();
    } catch (e) {
      alert("Sorry, failed to send. Please try again later.");
    }
  };

  if (done) {
    return (
      <div className="p-6 rounded-2xl bg-coal text-white shadow">
        <p className="text-lg">✅ Thanks! Your message was sent.</p>
        <button
          className="mt-4 px-4 py-2 bg-accent text-ink rounded-xl"
          onClick={() => setDone(false)}
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-6 rounded-2xl bg-coal text-white shadow bg-accent/20"
    >
      <div>
        <label className="block text-sm text-mist">Your name</label>
        <input
          {...register("name")}
          className="mt-1 w-full rounded-xl bg-ink px-3 py-2 bg-accent-content/30"
        />
        {errors.name && (
          <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm text-mist">Email</label>
        <input
          {...register("email")}
          className="mt-1 w-full rounded-xl bg-ink px-3 py-2 bg-accent-content/30"
        />
        {errors.email && (
          <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm text-mist">Company</label>
        <input
          {...register("company")}
          className="mt-1 w-full rounded-xl bg-ink px-3 py-2 bg-accent-content/30"
        />
      </div>
      <div>
        <label className="block text-sm text-mist">Message</label>
        <textarea
          rows={5}
          {...register("message")}
          className="mt-1 w-full rounded-xl bg-ink px-3 py-2 bg-accent-content/30"
        />
        {errors.message && (
          <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>
        )}
      </div>
      <button
        disabled={isSubmitting}
        className="px-4 py-2 rounded-xl bg-accent text-ink disabled:opacity-50"
      >
        {isSubmitting ? "Sending…" : "Send"}
      </button>
    </form>
  );
}
