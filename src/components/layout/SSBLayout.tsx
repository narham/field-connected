import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SSBBottomNav from "./SSBBottomNav";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

const SSBLayout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
      } else {
        // Cek apakah role-nya sesuai (opsional, tapi disarankan)
        const role = session.user.user_metadata.role;
        if (role !== "ssb") {
          navigate("/login");
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Outlet />
      <SSBBottomNav />
    </div>
  );
};

export default SSBLayout;
