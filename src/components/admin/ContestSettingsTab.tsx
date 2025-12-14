import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trophy, Target, Award, Medal, Save, Star } from "lucide-react";
import { translations as t } from "@/lib/translations";

interface ContestSetting {
  id: string;
  setting_key: string;
  setting_value: { value: number; currency?: string };
  description: string | null;
}

const settingLabels: Record<string, { label: string; icon: any; description: string }> = {
  points_exact_score: { label: "نقاط النتيجة الصحيحة", icon: Target, description: "النقاط الممنوحة عند توقع النتيجة الصحيحة بالضبط" },
  points_correct_result: { label: "نقاط الفائز الصحيح", icon: Star, description: "النقاط الممنوحة عند توقع الفائز أو التعادل بشكل صحيح" },
  points_first_scorer: { label: "نقاط الهداف الأول", icon: Award, description: "النقاط الممنوحة عند توقع الهداف الأول" },
  points_total_corners: { label: "نقاط الركنيات", icon: Target, description: "النقاط الممنوحة عند توقع عدد الركنيات الصحيح" },
  points_total_cards: { label: "نقاط البطاقات", icon: Target, description: "النقاط الممنوحة عند توقع عدد البطاقات الصحيح" },
  prize_first_place: { label: "جائزة المركز الأول", icon: Trophy, description: "الجائزة للفائز بالمركز الأول" },
  prize_second_place: { label: "جائزة المركز الثاني", icon: Medal, description: "الجائزة للفائز بالمركز الثاني" },
  prize_third_place: { label: "جائزة المركز الثالث", icon: Medal, description: "الجائزة للفائز بالمركز الثالث" },
};

export function ContestSettingsTab() {
  const [settings, setSettings] = useState<ContestSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editedValues, setEditedValues] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('contest_settings')
        .select('*')
        .order('setting_key');

      if (error) throw error;
      
      const typedData = (data || []).map(item => ({
        ...item,
        setting_value: item.setting_value as { value: number; currency?: string }
      }));
      
      setSettings(typedData);
      
      // Initialize edited values
      const values: Record<string, number> = {};
      typedData.forEach(s => {
        values[s.setting_key] = s.setting_value.value;
      });
      setEditedValues(values);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      for (const setting of settings) {
        const newValue = editedValues[setting.setting_key];
        if (newValue !== setting.setting_value.value) {
          const updatedValue = { ...setting.setting_value, value: newValue };
          const { error } = await supabase
            .from('contest_settings')
            .update({ setting_value: updatedValue })
            .eq('id', setting.id);

          if (error) throw error;
        }
      }

      toast.success("تم حفظ الإعدادات بنجاح");
      fetchSettings();
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ الإعدادات");
    } finally {
      setSaving(false);
    }
  };

  const pointsSettings = settings.filter(s => s.setting_key.startsWith('points_'));
  const prizeSettings = settings.filter(s => s.setting_key.startsWith('prize_'));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Points Settings */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            إعدادات النقاط
          </CardTitle>
          <CardDescription>
            حدد عدد النقاط الممنوحة لكل نوع من التوقعات الصحيحة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pointsSettings.map((setting) => {
              const config = settingLabels[setting.setting_key];
              const Icon = config?.icon || Target;
              return (
                <div key={setting.id} className="gaming-card p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-primary" />
                    <Label className="font-semibold">{config?.label || setting.setting_key}</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">{config?.description}</p>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="0"
                      value={editedValues[setting.setting_key] || 0}
                      onChange={(e) => setEditedValues(prev => ({
                        ...prev,
                        [setting.setting_key]: parseInt(e.target.value) || 0
                      }))}
                      className="text-center text-lg font-bold"
                    />
                    <span className="text-muted-foreground">نقطة</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Prize Settings */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-accent" />
            إعدادات الجوائز
          </CardTitle>
          <CardDescription>
            حدد قيمة الجوائز للفائزين بالمراكز الأولى
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {prizeSettings.map((setting, index) => {
              const config = settingLabels[setting.setting_key];
              const Icon = config?.icon || Trophy;
              const colors = [
                "from-yellow-500 to-amber-600",
                "from-slate-400 to-slate-500",
                "from-amber-700 to-orange-800"
              ];
              return (
                <div key={setting.id} className="relative gaming-card p-6 text-center space-y-4 overflow-hidden">
                  {/* Rank Badge */}
                  <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${colors[index]} -mr-4 -mt-4 rounded-full opacity-20`} />
                  
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${colors[index]} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg">{config?.label}</h3>
                    <p className="text-xs text-muted-foreground">{config?.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2">
                    <Input
                      type="number"
                      min="0"
                      value={editedValues[setting.setting_key] || 0}
                      onChange={(e) => setEditedValues(prev => ({
                        ...prev,
                        [setting.setting_key]: parseInt(e.target.value) || 0
                      }))}
                      className="w-28 text-center text-xl font-bold"
                    />
                    <span className="text-muted-foreground font-medium">{t.currency}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveAll} disabled={saving} size="lg" className="gap-2">
          <Save className="w-5 h-5" />
          {saving ? "جاري الحفظ..." : "حفظ جميع الإعدادات"}
        </Button>
      </div>
    </div>
  );
}