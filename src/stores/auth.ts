import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { defineStore } from "pinia"
import { ref } from "vue";

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const isInitialized = ref(false)


    async function initAuth() {
        const {data} = await supabase.auth.getSession();
        user.value = data.session?.user ?? null;
        isInitialized.value = true
        console.log(user.value)

        supabase.auth.onAuthStateChange((_event, session) => {
            user.value = session?.user ?? null;
        });
    }

    async function signIn(email:string, password:string): Promise<boolean>{
        loading.value = true;
        error.value = null
        const {data, error: signInError} = await supabase.auth.signInWithPassword({email, password});
        if (signInError) error.value = signInError.message;
        loading.value = false;
        if (signInError){
            error.value = signInError.message;
            return false;
        }
        return true;
    }
    async function signOut(){
        loading.value = true;
        error.value = null;
        await supabase.auth.signOut();
        loading.value = false;
    }
    async function signUp(email:string, password:string, name: string): Promise<boolean>{
        loading.value = true;
        error.value = null
        const {data, error: signUpError} = await supabase.auth.signUp({email, password});

        if (signUpError) {
            error.value = signUpError.message;
            loading.value = false;
            return false;
        }

        if (data.user) {
            const { error: updateError } = await supabase.from('profiles').insert({ id: data.user.id, name });
            if (updateError) {
                error.value = updateError.message;
                loading.value = false;
                return false;
            }
        }
        loading.value = false;
        return true;
    }

    return {user, loading, error, isInitialized, signIn, signOut, signUp, initAuth}
})