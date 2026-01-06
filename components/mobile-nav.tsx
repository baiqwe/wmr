"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MobileNavProps {
  items: { label: string; href: string }[];
  currentLocale?: string;
}

export function MobileNav({ items, currentLocale = 'en' }: MobileNavProps) {
  const pathname = usePathname();
  const localePrefix = `/${currentLocale}`;

  // 获取不带 locale 前缀的路径
  const getPathWithoutLocale = () => {
    if (!pathname) return '/';
    const withoutLocale = pathname.replace(/^\/(en|zh)/, '');
    return withoutLocale || '/';
  };

  const pathWithoutLocale = getPathWithoutLocale();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>{currentLocale === 'zh' ? '导航' : 'Navigation'}</SheetTitle>
        </SheetHeader>

        {/* Language Switcher for Mobile */}
        <div className="flex items-center gap-2 mt-4 pb-4 border-b">
          <span className="text-sm text-muted-foreground">
            {currentLocale === 'zh' ? '语言:' : 'Language:'}
          </span>
          <Link
            href={`/en${pathWithoutLocale}`}
            className={`px-3 py-1.5 rounded text-sm transition-colors ${currentLocale === 'en'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
          >
            EN
          </Link>
          <Link
            href={`/zh${pathWithoutLocale}`}
            className={`px-3 py-1.5 rounded text-sm transition-colors ${currentLocale === 'zh'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
          >
            中文
          </Link>
        </div>

        <nav className="flex flex-col gap-4 mt-4">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-lg font-semibold text-muted-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
