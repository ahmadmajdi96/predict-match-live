import { Link } from "react-router-dom";
import { translations as t } from "@/lib/translations";

export function FooterAr() {
  return (
    <footer className="border-t border-border/40 bg-card/30 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {/* Logo & Description */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
              <div className="flex flex-col items-end">
                <span className="font-display font-bold text-base md:text-lg leading-none">فوت بريديكت</span>
                <span className="text-[10px] md:text-xs text-primary font-semibold">برو</span>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-primary flex items-center justify-center">
                <span className="text-lg md:text-xl">⚽</span>
              </div>
            </Link>
            <p className="text-muted-foreground text-xs md:text-sm max-w-md text-right">
              أفضل منصة لتوقعات كرة القدم. توقع النتائج، تنافس مع الأصدقاء، واربح الجوائز.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm md:text-base mb-3 md:mb-4 text-right">روابط سريعة</h4>
            <ul className="space-y-1.5 md:space-y-2 text-right">
              <li>
                <Link to="/matches" className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t.matches}
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t.leaderboard}
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t.dashboard}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm md:text-base mb-3 md:mb-4 text-right">تواصل معنا</h4>
            <ul className="space-y-1.5 md:space-y-2 text-right">
              <li className="text-xs md:text-sm text-muted-foreground break-all">support@footpredict.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 mt-6 md:mt-8 pt-6 md:pt-8 text-center">
          <p className="text-xs md:text-sm text-muted-foreground">
            © {new Date().getFullYear()} فوت بريديكت برو. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}