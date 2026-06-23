export default function Footer() {
  return (
    <footer className="bg-canvas-parchment py-16">
      <div className="max-w-[980px] mx-auto px-6 text-center">
        <p className="text-ink-muted-48 font-body text-fine">
          证照优化大师 — AI 驱动的专业证件照优化工具
        </p>
        <p className="text-ink-muted-48 font-body text-fine mt-2">
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  )
}
