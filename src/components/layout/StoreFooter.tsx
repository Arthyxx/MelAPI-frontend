import { Link } from 'react-router-dom';

interface StoreFooterProps {
  isLogged: boolean;
}

export function StoreFooter({ isLogged }: StoreFooterProps) {
  return (
    <footer className="border-t border-amber-800 bg-amber-950 text-amber-50">
      <div className="container mx-auto grid gap-10 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-600 text-3xl shadow-inner">
              🍯
            </div>

            <div>
              <h3 className="text-xl font-black">Apiário Vitória Seven</h3>
              <p className="text-sm text-amber-200">
                Produtos naturais e artesanais
              </p>
            </div>
          </div>

          <p className="mt-5 max-w-md text-sm leading-relaxed text-amber-100">
            Loja especializada em produtos de mel, criada para oferecer uma
            experiência moderna, simples e confiável para clientes que procuram
            produtos naturais.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-amber-100">
              🐝 Natural
            </span>

            <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-amber-100">
              🍯 Artesanal
            </span>

            <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-amber-100">
              📦 Pedidos online
            </span>
          </div>
        </div>

        <div>
          <h4 className="font-black text-white">Loja</h4>

          <ul className="mt-4 space-y-3 text-sm text-amber-100">
            <li>
              <Link to="/produtos" className="transition hover:text-white">
                Produtos
              </Link>
            </li>

            <li>
              <Link to="/carrinho" className="transition hover:text-white">
                Carrinho
              </Link>
            </li>

            <li>
              <Link to="/meus-pedidos" className="transition hover:text-white">
                Meus pedidos
              </Link>
            </li>

            {!isLogged && (
              <li>
                <Link to="/login" className="transition hover:text-white">
                  Entrar
                </Link>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h4 className="font-black text-white">Atendimento</h4>

          <ul className="mt-4 space-y-3 text-sm text-amber-100">
            <li>📍 Viçosa do Ceará - CE</li>
            <li>📦 Entrega a combinar</li>
            <li>💬 Atendimento pelo vendedor</li>
            <li>🔒 Compra com login seguro</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5">
        <div className="container mx-auto flex flex-col gap-3 text-sm text-amber-200 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} Apiário Vitória Seven. Todos os
            direitos reservados.
          </p>

          <p>Desenvolvido com React + NestJS.</p>
        </div>
      </div>
    </footer>
  );
}