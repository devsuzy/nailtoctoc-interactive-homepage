import IcoLogoFooter from '@/assets/icons/ico-logo-footer.svg'
import Link from "next/link";
import IcoInstagramWhite from '@/assets/icons/ico-instagram-white.svg'
import IcoNaverBlogWhite from '@/assets/icons/ico-naver-blog-white.svg'

export default function Footer() {
  return (
    <footer className="mx-auto flex flex-col bg-foreground py-10 px-5 md:flex-row md:justify-start md:py-[3.75rem] md:px-[3.75rem]">
      {/* Company Info Section */}
      <div className="flex flex-col justify-around gap-4 md:gap-8 border-b border-white/10 pb-8 md:w-1/3 md:border-none md:pb-0">
        <IcoLogoFooter className="w-24 h-auto md:w-32" />
        <div className="flex flex-col gap-3 md:gap-5 text-xs text-white md:text-sm">
          <p>
            경기도 안양시 동안구 전파로 104번길23 동우빌딩 2층(우14041)<br/>
            사업자등록번호 169-81-02325
          </p>
          <div className="flex items-center gap-2">
            <p>대표 주장용</p>
            <span className="w-px h-3 bg-white/20"></span>
            <p>nailtoctoc@nailtoctoc.com</p>
          </div>
        </div>
        <p className="text-xs text-white/50 md:text-sm">Copyrights © 2025 NAILTOCTOC</p>
      </div>

      {/* Links Section */}
      <div className="flex flex-col gap-3 border-b border-white/10 pt-5 pb-8 md:w-1/3 md:border-none md:pb-0">
        <Link
          href="/#"
          className="text-xs underline text-white md:text-base"
        >
          회사소개서
        </Link>
        <Link
          href="/#"
          className="text-xs underline text-white md:text-base"
        >
          서비스이용약관
        </Link>
        <Link
          href="/#"
          className="text-xs underline text-white md:text-base"
        >
          개인정보처리방침
        </Link>
      </div>

      {/* Customer Center Section */}
      <div className="flex flex-col justify-around pt-5 pb-10 md:w-1/3">
        <div className="flex flex-col gap-1 mb-4">
          <p className="text-white/50 text-sm md:text-base">고객센터</p>
          <p className="text-white font-semibold text-base md:text-xl">031-429-9880</p>
        </div>
        <p className="text-white text-xs mb-5 md:mb-[3.75rem] md:text-sm">평일 9:00 - 18:00 (주말 및 공휴일 휴무)｜점심시간 12:00 ~ 13:00</p>
        <div className="flex items-center gap-3">
          <button className="border border-white/20 text-sm font-semibold text-white rounded-xl py-[0.875rem] px-10">상담 신청</button>
          <Link
            href="https://www.instagram.com/nailtoctoc_official"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IcoInstagramWhite />
          </Link>
          <Link
            href="https://blog.naver.com/nailtoctoc"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IcoNaverBlogWhite />
          </Link>
        </div>
      </div>
    </footer>
  )
}