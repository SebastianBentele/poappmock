import { CheckCircle2, Ticket, Wrench, Sparkles } from "lucide-react";
import { ChatInput } from "@/components/chat-input";

const chips = [
  "Reparatur melden",
  "Reinigung anfragen",
  "Abrechnungsfrage",
  "Ausstattung ändern",
  "Sonstiges",
];

const requests = [
  {
    id: "#1043",
    title: "Spülmaschine macht Geräusche",
    unit: "Altstadt Apartment",
    status: "Offen",
    icon: Wrench,
  },
  {
    id: "#1041",
    title: "WLAN-Router austauschen",
    unit: "Garten Apartment",
    status: "In Arbeit",
    icon: Wrench,
  },
  {
    id: "#1039",
    title: "Zusatzreinigung nach Late-Checkout",
    unit: "Studio Universität",
    status: "Offen",
    icon: Sparkles,
  },
];

export default function Anfrage() {
  return (
    <div className="min-h-screen flex flex-col items-center px-10 py-14">
      <h1 className="text-[40px] tracking-[-1px]">Anfrage stellen.</h1>
      <p className="text-[18px] text-muted mt-2 text-center max-w-[560px]">
        Beschreib dein Anliegen im Chat — wir erstellen automatisch ein Ticket
        und das Team kümmert sich darum.
      </p>

      <div className="flex gap-3 mt-8 flex-wrap justify-center">
        {chips.map((c) => (
          <button
            key={c}
            className="border border-line rounded-full px-5 py-2.5 text-[15px] hover:bg-panel"
          >
            {c}
          </button>
        ))}
      </div>

      {/* Example conversation */}
      <div className="w-full max-w-[760px] mt-10 flex flex-col gap-4">
        <div className="self-end max-w-[80%] bg-[#2a2a2a] text-white rounded-[22px] rounded-br-[6px] px-5 py-3.5 text-[15px] leading-snug">
          Die Spülmaschine im Altstadt Apartment macht seit gestern laute
          Geräusche beim Spülgang.
        </div>

        <div className="self-start max-w-[85%] flex gap-3">
          <span className="w-8 h-8 rounded-full bg-[#2a2a2a] text-white flex items-center justify-center text-[12px] shrink-0 mt-1">
            A
          </span>
          <div className="flex flex-col gap-3">
            <div className="bg-panel rounded-[22px] rounded-tl-[6px] px-5 py-3.5 text-[15px] leading-snug">
              Danke für deine Meldung! Ich habe ein Ticket für die Spülmaschine
              im Altstadt Apartment erstellt. Unser Operations-Team meldet sich
              innerhalb von 24 Stunden — den Status siehst du jederzeit unter
              Operations.
            </div>
            <div className="flex items-center gap-3 bg-white border border-line rounded-[18px] px-5 py-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
              <CheckCircle2 size={18} className="text-accent-text shrink-0" />
              <div className="flex-1">
                <div className="text-[15px]">Ticket erstellt · Spülmaschine macht Geräusche</div>
                <div className="text-[13px] text-muted">Altstadt Apartment · Priorität: Mittel</div>
              </div>
              <span className="flex items-center gap-1.5 bg-panel rounded-full px-3 py-1 text-[13px] text-muted">
                <Ticket size={13} />
                #1043
              </span>
            </div>
          </div>
        </div>
      </div>

      <ChatInput
        placeholder="Beschreib dein Anliegen..."
        className="w-full max-w-[760px] mt-8"
      />

      {/* Existing requests */}
      <div className="w-full max-w-[760px] bg-white border border-line rounded-[24px] p-7 mt-10 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <div className="flex items-start justify-between">
          <h3 className="text-[16px]">Deine Anfragen</h3>
          <span className="text-[13px] text-muted">Status live aus Operations</span>
        </div>
        <div className="mt-2 flex flex-col">
          {requests.map(({ id, title, unit, status, icon: Icon }, i) => (
            <div
              key={id}
              className={`flex items-center gap-4 py-3.5 ${i > 0 ? "border-t border-line" : ""}`}
            >
              <span className="w-10 h-10 rounded-full bg-panel flex items-center justify-center text-muted shrink-0">
                <Icon size={16} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[15px] leading-tight">{title}</div>
                <div className="text-[13px] text-muted mt-0.5">
                  {id} · {unit}
                </div>
              </div>
              <span
                className={`text-[13px] rounded-full px-3 py-1 ${
                  status === "In Arbeit"
                    ? "bg-[#eef5eb] text-accent-text"
                    : "bg-panel text-muted"
                }`}
              >
                {status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
