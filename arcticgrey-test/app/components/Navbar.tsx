import { NavLink } from '@remix-run/react';
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { MdOutlinePerson, MdOutlineShoppingBag } from "react-icons/md";
import { SearchForm } from '~/components/SearchForm';
import { LiaUserTieSolid } from "react-icons/lia";

export default function Navbar() {
  return (
    <div className="bg-white shadow-md p-0 mx-8 mt-4 rounded-lg">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold pl-4">DIEGOSTORETESTING</h1>
        <div className="flex items-center space-x-4">
          <SearchForm>
            {({ inputRef }) => (
              <div className="flex items-center">
                <input
                  ref={inputRef}
                  type="search"
                  name="q"
                  placeholder="Buscar..."
                  className="p-2 border rounded"
                />
                <HiMiniMagnifyingGlass className="ml-2 text-gray-500 text-2xl" />
              </div>
            )}
          </SearchForm>
          <nav className="flex space-x-4">
            <NavLink to="/shop" className="text-blue-500 hover:underline">Shop</NavLink>
            <NavLink to="/science" className="text-blue-500 hover:underline">Science</NavLink>
            <NavLink to="/podcasts" className="text-blue-500 hover:underline">Podcasts</NavLink>
            <NavLink to="/fashion" className="text-blue-500 hover:underline">Fashion</NavLink>
            <NavLink to="/blog" className="text-blue-500 hover:underline">Blog</NavLink>
          </nav>
        </div>
        <div className="flex items-center space-x-4 pr-4">
          <div className="bg-gray-300 p-2 rounded flex items-center">
            Men
            <LiaUserTieSolid className="ml-2 bg-white rounded-full text-2xl" />
          </div>
          <div className="bg-black text-white p-2 rounded">
            Take The Quiz
          </div>
          <MdOutlinePerson className="text-black p-2 text-5xl" />
          <MdOutlineShoppingBag className="text-black p-2 text-5xl" />
        </div>
      </div>
    </div>
  );
} 