import { Link } from "react-router-dom";
import { translations as t } from "@/lib/translations";

export function FooterAr() {
  return (
    <footer className="border-t border-border/40 bg-card/30 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="flex flex-col items-end">
                <span className="font-display font-bold text-lg leading-none">فوت بريديكت</span>
                <span className="text-xs text-primary font-semibold">برو</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-xl">⚽</span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md text-right">
              أفضل منصة لتوقعات كرة القدم. توقع النتائج، تنافس مع الأصدقاء، واربح الجوائز.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-right">روابط سريعة</h4>
            <ul className="space-y-2 text-right">
              <li>
                <Link to="/matches" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t.matches}
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t.leaderboard}
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t.dashboard}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-right">تواصل معنا</h4>
            <ul className="space-y-2 text-right">
              <li className="text-sm text-muted-foreground">support@footpredict.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} فوت بريديكت برو. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}