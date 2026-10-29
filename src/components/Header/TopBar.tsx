import Link from 'next/link'

export default function TopBar() {
  return (
    <header className="topbar">
      <div className="container">
        <div className="top-left">
          <span>info@printwater.com</span>
          <span>+90 212 269 52 42</span>
        </div>
        <div className="top-right">
          <span>LinkedIn</span>
          <span>Instagram</span>
          <span>TR</span>
        </div>
      </div>
    </header>
  )
}
