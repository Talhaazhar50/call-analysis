import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { getColors } from "../../styles/theme";

const BRAND = '#16a34a'

const navItems = [
    { path: '/dashboard', icon: '▦', label: 'Dashboard' },
    { path: '/dashboard/upload', icon: '⬆', label: 'Upload Call' },
    { path: '/dashboard/calls', icon: '🎧', label: 'My Calls' },
    { path: '/dashboard/settings', icon: '⚙️', label: 'Settings' },

]

export default function UserLayout() {
    const { dark, toggle } = useTheme()
    const C = getColors(dark)
    const navigate = useNavigate()
    const [collapsed, setCollapsed] = useState(false)

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: C.bg, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .user-nav-link { text-decoration: none; }
        .user-nav-link .nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 12px; border-radius: 8px;
          font-size: 14px; font-weight: 500;
          color: ${C.muted}; cursor: pointer;
          transition: background 0.15s, color 0.15s;
          white-space: nowrap; overflow: hidden;
        }
        .user-nav-link .nav-item:hover { background: ${C.hover}; color: ${C.text}; }
        .user-nav-link.active .nav-item { background: ${dark ? 'rgba(22,163,74,0.12)' : '#f0fdf4'}; color: ${BRAND}; font-weight: 600; }
        .toggle-switch { position: relative; width: 36px; height: 20px; cursor: pointer; }
        .toggle-switch input { opacity: 0; width: 0; height: 0; }
        .toggle-track {
          position: absolute; inset: 0; border-radius: 20px;
          background: ${dark ? BRAND : '#e5e7eb'}; transition: background 0.2s;
        }
        .toggle-thumb {
          position: absolute; top: 3px; left: ${dark ? '19px' : '3px'};
          width: 14px; height: 14px; border-radius: 50%;
          background: #fff; transition: left 0.2s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
      `}</style>

            {/* Sidebar */}
            <aside style={{
                width: collapsed ? 64 : 220,
                background: C.sidebar,
                borderRight: `1px solid ${C.border}`,
                display: 'flex', flexDirection: 'column',
                transition: 'width 0.2s ease',
                position: 'sticky', top: 0, height: '100vh', flexShrink: 0,
                overflow: 'hidden',
            }}>
                {/* Logo */}
                <div style={{
                    padding: collapsed ? '18px 0' : '18px 16px',
                    borderBottom: `1px solid ${C.border}`,
                    display: 'flex', alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'space-between',
                    gap: 10,
                }}>
                    {!collapsed && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                            <div style={{ width: 30, height: 30, borderRadius: 8, background: BRAND, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>🎧</div>
                            <span style={{ fontWeight: 800, fontSize: 15, color: C.text, letterSpacing: '-0.3px', whiteSpace: 'nowrap' }}>CallAnalytics</span>
                        </div>
                    )}
                    {collapsed && (
                        <div style={{ width: 30, height: 30, borderRadius: 8, background: BRAND, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>🎧</div>
                    )}
                    {!collapsed && (
                        <button onClick={() => setCollapsed(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: 16, padding: 2 }}>←</button>
                    )}
                </div>

                {collapsed && (
                    <button onClick={() => setCollapsed(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, padding: '12px 0', textAlign: 'center', fontSize: 16 }}>→</button>
                )}

                {/* Nav */}
                <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {!collapsed && (
                        <div style={{ fontSize: 10, fontWeight: 700, color: C.subtle, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 12px 8px' }}>
                            My Portal
                        </div>
                    )}
                    {navItems.map(item => (
                        <NavLink key={item.path} to={item.path} end={item.path === '/dashboard'} className="user-nav-link">
                            <div className="nav-item" style={{ justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '9px 0' : '9px 12px' }}>
                                <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                                {!collapsed && <span>{item.label}</span>}
                            </div>
                        </NavLink>
                    ))}
                </nav>

                {/* Bottom */}
                <div style={{ padding: '12px 8px', borderTop: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {/* Dark mode toggle */}
                    {!collapsed && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 12px' }}>
                            <span style={{ fontSize: 13, color: C.muted }}>{dark ? '🌙 Dark' : '☀️ Light'}</span>
                            <label className="toggle-switch">
                                <input type="checkbox" checked={dark} onChange={toggle} />
                                <div className="toggle-track"><div className="toggle-thumb" /></div>
                            </label>
                        </div>
                    )}

                    {/* User avatar */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '8px 12px', borderRadius: 8,
                        background: C.hover, cursor: 'pointer',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                    }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#7c3aed20', border: '1.5px solid #7c3aed40', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#7c3aed' }}>SA</span>
                        </div>
                        {!collapsed && (
                            <div style={{ minWidth: 0 }}>
                                <div style={{ fontSize: 12, fontWeight: 600, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Sarah Ahmed</div>
                                <div style={{ fontSize: 10, color: C.muted }}>Agent</div>
                            </div>
                        )}
                    </div>

                    {/* Sign out */}
                    {!collapsed && (
                        <button
                            onClick={() => navigate('/login')}
                            style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '7px 12px', borderRadius: 8, fontSize: 13, color: C.muted, textAlign: 'left', transition: 'background 0.15s' }}
                            onMouseEnter={e => e.target.style.background = C.hover}
                            onMouseLeave={e => e.target.style.background = 'none'}
                        >
                            ↩ Sign out
                        </button>
                    )}
                </div>
            </aside>

            {/* Main */}
            <main style={{ flex: 1, minWidth: 0, overflowY: 'auto' }}>
                <Outlet context={{ dark, C }} />
            </main>
        </div>
    )
}