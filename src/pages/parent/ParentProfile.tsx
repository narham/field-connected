import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, LogOut, Settings, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

const ParentProfile = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="px-4 py-6 space-y-6">
      <header>
        <h2 className="text-xl font-bold">Profil Saya</h2>
        <p className="text-xs text-muted-foreground">Kelola informasi akun dan preferensi.</p>
      </header>
      
      <Card className="shadow-sm border-slate-100">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Profil Orang Tua</h3>
              <p className="text-xs text-muted-foreground">Detail kontak & keamanan</p>
            </div>
          </div>
          
          <div className="grid gap-2 pt-4">
            <Button variant="outline" className="w-full justify-between text-xs h-10 px-4">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span>Pengaturan Akun</span>
              </div>
              <Shield className="w-3 h-3 text-muted-foreground" />
            </Button>
            
            <Button 
              variant="destructive" 
              className="w-full justify-start text-xs h-10 px-4 gap-2"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar Sesi</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParentProfile;
