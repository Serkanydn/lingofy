'use client';

import Link from "next/link";
import { useSettingsStore } from "@/features/admin/features/settings/store/settingsStore";
import { Mail, Heart } from "lucide-react";

/**
 * Footer Component
 * 
 * Site footer with dynamic content from settings.
 * Features:
 * - Site name from settings
 * - Contact and support email links
 * - Quick links to main sections
 * - Copyright notice
 * 
 * @component
 */
export default function Footer() {
  const siteName = useSettingsStore((state) => state.getSiteName());
  const contactEmail = useSettingsStore((state) => state.getContactEmail());
  const supportEmail = useSettingsStore((state) => state.getSupportEmail());

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {siteName}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Master English through interactive lessons, practice exercises, and comprehensive quizzes.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/grammar"
                  className="text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                >
                  Grammar
                </Link>
              </li>
              <li>
                <Link
                  href="/listening"
                  className="text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                >
                  Listening
                </Link>
              </li>
              <li>
                <Link
                  href="/reading"
                  className="text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                >
                  Reading
                </Link>
              </li>
              <li>
                <Link
                  href="/premium"
                  className="text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                >
                  Premium
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
              Contact
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href={`mailto:${contactEmail}`}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${supportEmail}`}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © {currentYear} {siteName}. All rights reserved.
            </p>
            <p className="flex items-center gap-1 text-gray-600 dark:text-gray-400 text-sm">
              Made with <Heart className="h-4 w-4 text-red-500 fill-current" /> for English learners
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}