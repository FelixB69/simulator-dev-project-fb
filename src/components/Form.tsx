"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import LiquidWaveBackground from "./ui/LiquideWaveBackground";
import ResultSkeleton from "./ResultSkeleton";

const FIELDS = [
  {
    name: "location",
    label: "Localisation",
    type: "text",
    placeholder: "Lyon",
  },
  {
    name: "compensation",
    label: "Salaire Brut (€)",
    type: "number",
    placeholder: "47000",
  },
  {
    name: "total_xp",
    label: "Expérience (années)",
    type: "number",
    placeholder: "3",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "votre.email@exemple.com",
  },
] as const;

const schema = z.object({
  location: z.string().min(2, "Localisation requise"),
  compensation: z.coerce.number().min(1, "Salaire invalide"),
  total_xp: z.coerce.number().min(0, "Expérience invalide"),
  email: z.string().email("Email invalide"),
  consent: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter d’être recontacté.",
  }),
});

type FormData = z.infer<typeof schema>;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function LandingForm() {
  const [phase, setPhase] = useState<"form" | "loading">("form");
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      location: "",
      compensation: undefined,
      total_xp: undefined,
      email: "",
      consent: false,
    },
  });

  const isDisabled =
    form.formState.isSubmitting ||
    !form.watch("location") ||
    !form.watch("compensation") ||
    !form.watch("total_xp") ||
    !form.watch("email") ||
    !form.watch("consent") ||
    Object.keys(form.formState.errors).length > 0;

  const handleSubmit = async (data: FormData) => {
    const MIN_LOADING_MS = 800;
    setPhase("loading");

    try {
      const [res] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL!}/scores/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }),
        sleep(MIN_LOADING_MS),
      ]);
      if (!res.ok) throw new Error("Erreur lors du POST");

      const { id } = await res.json();
      router.push(`/scores/${id}`);
    } catch (e) {
      console.error(e);
      alert("Erreur lors de l'envoi des données.");
      setPhase("form");
    }
  };

  return (
    <div className="relative min-h-screen bg-[var(--gray-light)] flex items-center justify-center overflow-hidden">
      {phase === "form" && <LiquidWaveBackground />}

      <AnimatePresence mode="wait">
        {phase === "form" && (
          <motion.div
            key="form"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 w-full max-w-md sm:max-w-xl md:max-w-2xl mx-auto"
          >
            <div className="text-center mb-6 sm:mb-8 sm:mt-0 mt-8 px-2 sm:px-0">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--blue)] leading-tight">
                Votre salaire est-il aligné avec le marché ?
              </h1>
              <p className="mt-4 text-[var(--gray-dark)] text-base sm:text-lg">
                Grâce à notre{" "}
                <span className="font-semibold text-[var(--blue)]">
                  modèle de prédiction
                </span>{" "}
                basé sur plus de 800 salaires analysés, découvrez en quelques
                secondes si votre rémunération est cohérente.
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6"
              >
                {FIELDS.map((field) => (
                  <FormField
                    key={field.name}
                    control={form.control}
                    name={field.name as keyof FormData}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel>{field.label}</FormLabel>
                        <FormControl>
                          <Input
                            type={field.type}
                            placeholder={field.placeholder}
                            value={
                              typeof f.value === "boolean"
                                ? ""
                                : (f.value as any) ?? ""
                            }
                            onChange={(e) =>
                              f.onChange(
                                field.type === "number"
                                  ? Number(e.target.value)
                                  : e.target.value,
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}

                <FormField
                  control={form.control}
                  name="consent"
                  render={({ field }) => (
                    <FormItem className="flex items-start gap-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="consent"
                          className="border-gray-300 cursor-pointer"
                        />
                      </FormControl>
                      <FormLabel
                        htmlFor="consent"
                        className="text-sm font-normal text-[var(--gray-dark)]"
                      >
                        En fournissant mon adresse email, j’accepte d’être
                        recontacté à des fins d’échange ou de suivi.
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isDisabled}
                  className={cn(
                    "w-full bg-[var(--blue)] hover:bg-[var(--blue)]/90 text-white font-semibold py-3 cursor-pointer",
                    isDisabled && "opacity-50 cursor-not-allowed",
                  )}
                >
                  {form.formState.isSubmitting
                    ? "Envoi en cours..."
                    : "Vérifier mon salaire"}
                </Button>
              </form>
            </Form>
          </motion.div>
        )}

        {phase === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-4xl mx-auto py-12 px-4 text-center text-[var(--gray-dark)]"
          >
            <ResultSkeleton />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
