// src/components/tickets/TicketQRCode.tsx

import Image from "next/image";
import QRCode from "qrcode";

type Props = {
  value: string;
};

export default async function TicketQRCode({ value }: Props) {
  const dataUrl = await QRCode.toDataURL(value, {
    width: 320,
    margin: 1,
  });

  return (
    <div className="rounded-3xl border border-white/10 bg-white p-4 shadow-2xl">
      <Image
        src={dataUrl}
        alt="Ticket QR Code"
        width={320}
        height={320}
        className="h-auto w-full max-w-70 rounded-xl"
        unoptimized
      />
    </div>
  );
}