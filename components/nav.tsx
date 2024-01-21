import Link from 'next/link';
import { auth } from '@clerk/nextjs';
import { ArrowRight } from 'lucide-react';

import { Button, buttonVariants } from '@/components/ui/button';
import Wrapper from '@/components/wrapper';

interface NavbarProps{
  href?:string;
  ButtonName?:string;
}

export default function Navbar({href, ButtonName}:NavbarProps) {
  return (
    <nav className='sticky inset-x-0 top-0 z-30 h-14 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all'>
      <Wrapper>
        <div className='flex h-14 items-center justify-between border-b border-zinc-200'>
          <Link href='/' className='z-40 flex font-semibold'>
            <span>tree-visualizer</span>
          </Link>
          <div className='flex items-center space-x-4'>
            <Link
              href='/'
              className={buttonVariants({
                variant: 'ghost',
                size: 'sm',
              })}
            >
              Documentation
            </Link>

            { (href && ButtonName) ? (
              <Link
                href={href}
                className={buttonVariants({
                  size: 'sm',
                })}
                >
                {ButtonName} <ArrowRight className='ml-1.5 h-5 w-5' />
              </Link>
            ):(

              <Link
                href='/tree'
                className={buttonVariants({
                  size: 'sm',
                })}
                >
                Get started <ArrowRight className='ml-1.5 h-5 w-5' />
              </Link>

            )}

          </div>
        </div>
      </Wrapper>
    </nav>
  );
}
