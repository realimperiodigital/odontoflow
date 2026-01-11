"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

export default function FirstAccessPage() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < 6) {
            setError("A senha deve ter pelo menos 6 caracteres.");
            return;
        }
        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }

        setLoading(true);

        try {
            // 1. Update Auth Password
            const { error: authError } = await supabase.auth.updateUser({
                password: password
            });

            if (authError) throw authError;

            // 2. Update Profile must_change_password = false
            // We need to do this via an update to the profile.
            // Assuming RLS allows users to update THEIR OWN profile's `must_change_password`.
            // If RLS blocks this, we might need a workaround or ensure the policy allows it.
            // (The dashboard will check this flag. If we can't update it, we get stuck loop).

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Usuário não encontrado.");

            const { error: profileError } = await supabase
                .from('profiles')
                .update({ must_change_password: false })
                .eq('user_id', user.id);

            if (profileError) throw profileError;

            // Success
            alert("Senha alterada com sucesso!");
            router.push("/dashboard");
            router.refresh();

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Erro ao atualizar senha.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050b14] flex flex-col items-center justify-center text-white p-4">
            <div className="w-full max-w-md bg-[#020b16] border border-[#0ea5ff33] rounded-2xl p-8 shadow-2xl">
                <h1 className="text-2xl font-bold text-[#0ea5ff] mb-2 text-center">Primeiro Acesso</h1>
                <p className="text-gray-400 text-sm text-center mb-6">
                    Por segurança, você deve alterar sua senha provisória antes de continuar.
                </p>

                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Nova Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#061527] border border-[#0ea5ff22] text-white p-3 rounded-lg focus:outline-none focus:border-[#0ea5ff]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Confirmar Senha</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-[#061527] border border-[#0ea5ff22] text-white p-3 rounded-lg focus:outline-none focus:border-[#0ea5ff]"
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-900/40 border border-red-800 rounded-lg text-red-200 text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-lg font-bold text-[#001018] transition-colors ${loading ? "bg-gray-600 cursor-not-allowed" : "bg-[#0ea5ff] hover:bg-[#009acb]"
                            }`}
                    >
                        {loading ? "Salvando..." : "Salvar e Continuar"}
                    </button>
                </form>
            </div>
        </div>
    );
}
