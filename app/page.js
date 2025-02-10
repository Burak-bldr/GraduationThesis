import Resim from "./İmages/resim.png"

import Image from "next/image";

export default function Home() {
  return (
<main className="relative w-screen h-screen flex items-center justify-center">
    
<Image
        src={Resim}
        alt="EV Way"
        fill
        quality={100} 
        className="object-cover"
      />
     
      <h1 className="absolute top-3 right-50 text-white text-3xl font-bold bg-black bg-opacity-90 px-4 py-2 rounded-lg">Welcome to EV way</h1>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-black bg-opacity-90 text-white p-6 rounded-lg max-w-3xl text-center">
          <h2 className="text-2xl font-semibold mb-2">EV Way Nedir?</h2>
          <p className="text-lg">
            EV Way, elektrikli araç sahiplerinin birbirleriyle şarj istasyonlarını paylaşmalarını sağlayan yenilikçi bir platformdur.
            Kullanıcılar, kendi şarj istasyonlarını kiralayabilir, yakındaki istasyonları haritada görüntüleyebilir ve rezervasyon yapabilirler.

          </p>
        </div>
      </div>
    </main>


  );
}
