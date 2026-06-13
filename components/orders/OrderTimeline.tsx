import type { DeliveryOrder } from "@/lib/types";

export function OrderTimeline({ order }: { order: DeliveryOrder }) {
  return (
    <section className="card rounded-[28px] p-6 md:p-8">
      <div>
        <p className="text-sm font-medium text-[#1f7a55]">Status timeline</p>
        <h2 className="mt-2 text-2xl font-medium tracking-[-0.035em] text-[#071a2f]">
          Track every important delivery event.
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#667085]">
          Backend will later return real timestamped events for quote, rider
          assignment, pickup, transit, delivery, failed delivery, dispute, and
          support actions.
        </p>
      </div>

      <div className="mt-8 space-y-5">
        {order.timeline.map((event, index) => (
          <div key={`${event.status}-${event.time}`} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-[#071a2f] text-xs font-medium text-white">
                {index + 1}
              </div>
              {index !== order.timeline.length - 1 ? (
                <div className="mt-2 h-full min-h-10 w-px bg-[#e5ded2]" />
              ) : null}
            </div>

            <div className="pb-5">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-sm font-medium text-[#071a2f]">
                  {event.label}
                </h3>
                <span className="text-xs text-[#667085]">{event.time}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-[#667085]">
                {event.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
