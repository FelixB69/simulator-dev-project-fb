"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { BorderBeam } from "./magicui/border-beam";
import { useState } from "react";
import ProcessTerminal from "./ProcessTerminal";
import ScoreResult from "./ScoreResult";

const formSchema = z.object({
  location: z.string().min(2, "La localisation est requise"),
  compensation: z.coerce
    .number()
    .min(1, "La compensation doit être un nombre valide"),
  total_xp: z.coerce.number().min(0, "L'expérience doit être positive"),
  email: z.string().email("Email invalide"),
  consent: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter d’être recontacté.",
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function CustomForm() {
  const [showTerminal, setShowTerminal] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isTerminalComplete, setIsTerminalComplete] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      compensation: undefined,
      total_xp: undefined,
      email: "",
      consent: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    setShowTerminal(true);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Erreur lors de l'envoi");

      const resData = await response.json();
      setResult(resData);
    } catch (error) {
      console.error("Erreur :", error);
      alert("Échec de l'envoi des données.");
    }
  };

  const isDisabled =
    form.formState.isSubmitting ||
    !form.watch("location") ||
    !form.watch("compensation") ||
    !form.watch("total_xp") ||
    !form.watch("email") ||
    !form.watch("consent") ||
    Object.keys(form.formState.errors).length > 0;

  return (
    <>
      {showTerminal ? (
        isTerminalComplete ? (
          result ? (
            <ScoreResult result={result} />
          ) : null
        ) : (
          <ProcessTerminal onComplete={() => setIsTerminalComplete(true)} />
        )
      ) : (
        <div className="flex items-center justify-center min-h-screen bg-[var(--gray-light)] px-4">
          <div
            className="relative bg-[var(--white)] shadow-lg rounded-[var(--radius)] p-8 w-full max-w-xl sm:p-6 sm:max-w-lg
             animate-in fade-in-0 zoom-in-95 duration-800 ease-out"
          >
            <BorderBeam className="absolute inset-0 rounded-[var(--radius)]" />

            <h2 className="text-2xl font-bold mb-6 text-[var(--gray-dark)] relative z-10">
              Tes informations salariales
            </h2>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 relative z-10"
              >
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Localisation</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ex: Lyon" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="compensation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salaire (brut annuel/€)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="Ex: 47000"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="total_xp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expérience (années)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" placeholder="Ex: 3" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="Ex: bonjour@felixberger.fr"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="consent"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="consent"
                          className="cursor-pointer"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-snug">
                        <FormLabel
                          htmlFor="consent"
                          className="text-sm font-normal"
                        >
                          En fournissant mon adresse email, j’accepte d’être
                          recontacté par l’administrateur du site à des fins
                          d’échange ou de suivi.
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isDisabled}
                  className="w-full cursor-pointer bg-[var(--blue)] text-white hover:bg-[var(--gray-dark)] transition duration-200"
                >
                  {form.formState.isSubmitting
                    ? "Envoi..."
                    : "Calculer son score"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      )}
    </>
  );
}
