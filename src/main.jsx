import React, {useMemo, useState} from "react";
import { createRoot } from "react-dom/client";
import {
  Trophy, MessageCircle, Users, LayoutDashboard, LogOut, Send,
  CircleDot, Calendar, Crown, Shield, Gamepad2, Menu, X
} from "lucide-react";
import "./styles.css";

const initialMatches = [
  {id:1, round:0, a:"Shadow", b:"DarkWolf", sa:2, sb:1, status:"Zakończony", winner:"Shadow"},
  {id:2, round:0, a:"PlayerOne", b:"Legend", sa:0, sb:2, status:"Zakończony", winner:"Legend"},
  {id:3, round:0, a:"SpeedRunner", b:"KillerX", sa:2, sb:0, status:"Zakończony", winner:"SpeedRunner"},
  {id:4, round:0, a:"GamingPro", b:"NoobMaster", sa:1, sb:2, status:"Zakończony", winner:"NoobMaster"},
  {id:5, round:1, a:"Shadow", b:"Legend", sa:1, sb:2, status:"Zakończony", winner:"Legend"},
  {id:6, round:1, a:"SpeedRunner", b:"NoobMaster", sa:1, sb:1, status:"Na żywo", winner:null},
  {id:7, round:2, a:"Legend", b:"TBD", sa:null, sb:null, status:"Nadchodzący", winner:null},
];

function Login({onLogin}) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const submit = e => {
    e.preventDefault();
    if (name.trim().length < 3) return setError("Nazwa użytkownika musi mieć minimum 3 znaki.");
    onLogin(name.trim());
  };
  return <div className="login-page">
    <div className="login-card">
      <div className="brand-icon"><Trophy size={34}/></div>
      <h1>ESPORT ARENA</h1>
      <p>Dołącz do profesjonalnej platformy turniejowej.</p>
      <form onSubmit={submit}>
        <label>Nazwa gracza</label>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="np. ProGamerPL" autoFocus/>
        {error && <div className="error">{error}</div>}
        <button className="primary full">Wejdź do platformy</button>
      </form>
      <small>Wersja demonstracyjna • lokalne logowanie</small>
    </div>
  </div>
}

function Match({match, admin, onUpdate}) {
  const edit = () => {
    const sa = prompt(`Wynik ${match.a}`, match.sa ?? "");
    const sb = prompt(`Wynik ${match.b}`, match.sb ?? "");
    if (sa === null || sb === null) return;
    const a = Number(sa), b = Number(sb);
    if (!Number.isFinite(a) || !Number.isFinite(b)) return alert("Podaj poprawne liczby.");
    onUpdate(match.id, a, b);
  };
  return <div className={`match ${match.status === "Na żywo" ? "live-match" : ""}`} onClick={admin ? edit : undefined}>
    <div className={`team ${match.winner===match.a ? "winner":""}`}><span>{match.a}</span><b>{match.sa ?? "-"}</b></div>
    <div className={`team ${match.winner===match.b ? "winner":""}`}><span>{match.b}</span><b>{match.sb ?? "-"}</b></div>
    <div className="match-status">{match.status==="Na żywo" && <CircleDot size={12}/>} {match.status}</div>
  </div>
}

function Bracket({matches, admin, onUpdate}) {
  const rounds = ["Ćwierćfinały","Półfinały","Wielki finał"];
  return <div className="bracket-wrap">
    <div className="bracket">
      {rounds.map((title,i)=><div className="round" key={title}>
        <h3>{title}</h3>
        <div className="round-matches">
          {matches.filter(m=>m.round===i).map(m=><Match key={m.id} match={m} admin={admin} onUpdate={onUpdate}/>)}
        </div>
      </div>)}
      <div className="champion-card">
        <Crown size={30}/>
        <span>MISTRZ</span>
        <strong>{matches.find(m=>m.id===7)?.winner || "TBD"}</strong>
      </div>
    </div>
  </div>
}

function App() {
  const [user,setUser] = useState(localStorage.getItem("ea_user") || "");
  const [matches,setMatches] = useState(initialMatches);
  const [messages,setMessages] = useState([
    {user:"System", text:"Witaj na oficjalnym chacie turnieju!", system:true},
    {user:"Legend", text:"Powodzenia wszystkim! 🔥"},
    {user:"Shadow", text:"Dobry mecz 👏"}
  ]);
  const [text,setText] = useState("");
  const [admin,setAdmin] = useState(false);
  const [mobile,setMobile] = useState(false);

  const login = name => {localStorage.setItem("ea_user",name); setUser(name)};
  const logout = () => {localStorage.removeItem("ea_user"); setUser("")};
  const updateMatch = (id,sa,sb) => setMatches(old=>old.map(m=>{
    if(m.id!==id) return m;
    const winner = sa===sb ? null : sa>sb ? m.a : m.b;
    return {...m,sa,sb,winner,status:"Zakończony"};
  }));
  const send = () => {
    if(!text.trim()) return;
    setMessages(x=>[...x,{user,text:text.trim()}]); setText("");
  };
  const stats = useMemo(()=>({
    completed: matches.filter(x=>x.status==="Zakończony").length,
    live: matches.filter(x=>x.status==="Na żywo").length,
  }),[matches]);

  if(!user) return <Login onLogin={login}/>;

  return <div className="app-shell">
    <aside className={mobile ? "sidebar open":"sidebar"}>
      <div className="sidebar-brand"><Trophy/> <span>ESPORT<br/><b>ARENA</b></span><button className="mobile-close" onClick={()=>setMobile(false)}><X/></button></div>
      <nav>
        <a className="active"><LayoutDashboard/> Dashboard</a>
        <a><Trophy/> Turnieje</a>
        <a><Gamepad2/> Mecze</a>
        <a><Users/> Ranking</a>
        <a><MessageCircle/> Wiadomości</a>
      </nav>
      <div className="sidebar-bottom">
        <button className={`admin-switch ${admin?"enabled":""}`} onClick={()=>setAdmin(!admin)}><Shield size={17}/> {admin?"Tryb administratora":"Włącz administratora"}</button>
        <button onClick={logout} className="logout-side"><LogOut/> Wyloguj się</button>
      </div>
    </aside>

    <main className="main">
      <header>
        <button className="menu-btn" onClick={()=>setMobile(true)}><Menu/></button>
        <div>
          <p className="eyebrow">SEZON JESIEŃ 2026</p>
          <h1>Champions Cup <span>2026</span></h1>
        </div>
        <div className="header-user">
          <div className="avatar">{user.slice(0,1).toUpperCase()}</div>
          <div><b>{user}</b><small>Gracz</small></div>
        </div>
      </header>

      <section className="hero">
        <div>
          <span className="badge"><CircleDot size={14}/> TURNIEJ NA ŻYWO</span>
          <h2>Champions Cup 2026</h2>
          <p>Rywalizacja najlepszych graczy. Śledź mecze, wyniki i drogę do mistrzostwa.</p>
          <div className="hero-meta"><span><Calendar size={16}/> 13 września 2026</span><span><Users size={16}/> 8 zawodników</span></div>
        </div>
        <div className="prize"><small>PULA NAGRÓD</small><strong>10 000 PLN</strong><span>🏆</span></div>
      </section>

      <section className="stats">
        <div className="stat"><span>UCZESTNICY</span><b>8</b><Users/></div>
        <div className="stat"><span>MECZE ZAKOŃCZONE</span><b>{stats.completed}</b><Trophy/></div>
        <div className="stat"><span>NA ŻYWO</span><b>{stats.live}</b><CircleDot/></div>
        <div className="stat"><span>STATUS</span><b>ACTIVE</b><Shield/></div>
      </section>

      <section className="content-grid">
        <div className="panel bracket-panel">
          <div className="panel-head"><div><h2>Drabinka turniejowa</h2><p>{admin ? "Kliknij mecz, aby edytować wynik." : "Aktualne wyniki turnieju."}</p></div><button className="secondary">Single Elimination</button></div>
          <Bracket matches={matches} admin={admin} onUpdate={updateMatch}/>
        </div>

        <div className="panel chat-panel">
          <div className="panel-head"><div><h2><MessageCircle size={19}/> Chat na żywo</h2><p>{messages.length} wiadomości</p></div><span className="online"><i/> ONLINE</span></div>
          <div className="messages">
            {messages.map((m,i)=><div className={`message ${m.system?"system":""}`} key={i}>
              <div className="message-avatar">{m.user.slice(0,1).toUpperCase()}</div>
              <div><b>{m.user}</b><p>{m.text}</p></div>
            </div>)}
          </div>
          <div className="chat-input">
            <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Napisz wiadomość..."/>
            <button onClick={send}><Send size={18}/></button>
          </div>
        </div>
      </section>
    </main>
  </div>
}

createRoot(document.getElementById("root")).render(<App/>);
