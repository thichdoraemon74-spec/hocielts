import dynamic from 'next/dynamic';

const IELTSApp = dynamic(() => import('@/components/IELTSApp'), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-screen">Loading...</div>
});

export default function Home() {
  return <IELTSApp />;
}
