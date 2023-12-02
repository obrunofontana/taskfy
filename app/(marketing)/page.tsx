import { Medal } from 'lucide-react';
import { Poppins } from 'next/font/google';
import localFont from 'next/font/local';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const headingFont = localFont({
  src: '../../public/fonts/font.woff2',
});

const textFont = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

const MarketingPage = () => {
  return (
    <div className="flex items-center justify-center flex-col">
      <div
        className={cn(
          'flex items-center justify-center flex-col',
          headingFont.className
        )}
      >
        <div
          className="mb-4 flex items-center border shadow-sm p-4
          bg-amber-100 text-amber-700 rounded-full uppercase"
        >
          <Medal className="h-6 w-6 mr-2" />
          O melhor em gerenciar tarefas
        </div>
        <h1 className="text-3xl md:text-6xl text-center text-neutral-800 mb-6">
          Taskify ajuda a equipe a se mover
        </h1>
        <div
          className="text-3xl md:text-6xl bg-gradient-to-r
        from-fuchsia-600 to-pink-600 text-white px-4 p-2 rounded-md pb-4 w-fit"
        >
          Avance com determinação.
        </div>
      </div>
      <div
        className={cn(
          'text-sm md:text-xl text-neutral-400 mt-4 max-w-xs md:max-w-2xl text-center mx-auto',
          textFont.className
        )}
      >
        Colabore, gerencie projetos e alcance novos picos de produtividade. De
        desde arranha-céus até o home office, a forma como sua equipe trabalha é
        única - faça tudo isso com Taskify
      </div>
      <Button className="mt-6" size="lg" asChild>
        <Link href="/sign-up">Obtenha o Taskify gratuitamente</Link>
      </Button>
    </div>
  );
};

export default MarketingPage;
