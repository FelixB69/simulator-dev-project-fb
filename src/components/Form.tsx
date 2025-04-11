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
    },
  });

  const onSubmit = async (data: FormData) => {
    setShowTerminal(true);

    try {
      const response = await fetch("http://localhost:3000/scores/statistics", {
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
        <div className="flex items-center justify-center min-h-screen bg-[var(--gray-light)] p-6">
          <div className="relative bg-[var(--white)] shadow-lg rounded-[var(--radius)] p-6 w-full max-w-md">
            <BorderBeam className="absolute inset-0 rounded-[var(--radius)]" />

            <h2 className="text-2xl font-bold mb-4 text-[var(--gray-dark)] relative z-10">
              Vos informations salariales
            </h2>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 relative z-10"
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
                          placeholder="Ex: 40000"
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

                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full"
                >
                  {form.formState.isSubmitting ? "Envoi..." : "Envoyer"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      )}
    </>
  );
}
