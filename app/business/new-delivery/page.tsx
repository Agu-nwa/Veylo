import { BusinessShell } from "@/components/business/BusinessShell";

export default function BusinessNewDeliveryPage() {
  return (
    <BusinessShell
      eyebrow="Create delivery"
      title="Create a repeat business delivery with clear estimate and proof rules."
      body="This frontend screen prepares the business delivery creation flow. Backend will later connect saved recipients, business discounts, quote generation, payment state, and order history."
    >
      <section className="card rounded-[32px] p-5 md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.75fr]">
          <form className="grid gap-5">
            <div className="grid gap-4 md:grid-cols-2">
              <label>
                <span className="label">Pickup location</span>
                <input className="field" placeholder="Business pickup address" />
              </label>
              <label>
                <span className="label">Recipient / customer</span>
                <input className="field" placeholder="Customer name" />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label>
                <span className="label">Drop-off address</span>
                <input className="field" placeholder="Customer delivery address" />
              </label>
              <label>
                <span className="label">Recipient phone</span>
                <input className="field" placeholder="Recipient phone number" />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <label>
                <span className="label">Package category</span>
                <select className="field">
                  <option>Small parcel</option>
                  <option>Food package</option>
                  <option>Document</option>
                  <option>Fragile item</option>
                </select>
              </label>

              <label>
                <span className="label">Urgency</span>
                <select className="field">
                  <option>Standard</option>
                  <option>Express</option>
                  <option>Scheduled</option>
                </select>
              </label>

              <label>
                <span className="label">Business account</span>
                <select className="field">
                  <option>Growth Vendor</option>
                  <option>Pay-as-you-go Business</option>
                  <option>Corporate Account</option>
                </select>
              </label>
            </div>

            <textarea
              className="field"
              rows={5}
              placeholder="Delivery note, package instruction, recipient landmark, or support instruction"
            />

            <label className="flex items-start gap-3 rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4">
              <input type="checkbox" className="mt-1 h-4 w-4" />
              <span>
                <span className="block text-sm font-medium text-[#071a2f]">
                  I confirm this delivery follows Veylo business delivery rules
                </span>
                <span className="mt-1 block text-xs leading-5 text-[#667085]">
                  Restricted items, declared value, waiting rules, proof, and support policies apply.
                </span>
              </span>
            </label>

            <button
              type="button"
              className="rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white"
            >
              Generate business estimate
            </button>
          </form>

          <aside className="rounded-[28px] bg-[#071a2f] p-6 text-white">
            <p className="text-sm text-white/70">Business quote preview</p>
            <p className="mt-2 text-4xl font-medium tracking-[-0.05em]">₦2,150</p>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Mock estimate with business plan discount placeholder.
            </p>

            <div className="mt-6 space-y-3">
              {[
                ["Base estimate", "₦2,550"],
                ["Plan discount", "-₦400"],
                ["Proof", "OTP + photo if required"],
                ["Status", "Ready for backend"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-2xl bg-white/8 px-4 py-3 text-sm"
                >
                  <span className="text-white/60">{label}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </BusinessShell>
  );
}
