import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ggwvhwhyzbhundohxgzh.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdnd3Zod2h5emJodW5kb2h4Z3poIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5OTg2MzcsImV4cCI6MjA4NzU3NDYzN30.wCIetQaKL_EYLWcvmI9MaXqiT-NR8p7uiuZQXvGoeC0";

export const supabase = createClient(supabaseUrl, supabaseKey);
