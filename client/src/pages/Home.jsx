import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../api/client.js';
import ListingCard from '../components/ListingCard.jsx';
import Loader from '../components/Loader.jsx';
import { STAY_TYPES } from '../utils/format.js';

const initial = { city: '', type: '', guests: '', maxPrice: '', sort: '', page: 1 };

export default function Home() {
  const [filters, setFilters] = useState(initial);
  const [data, setData] = useState({ listings: [], page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const search = (params) => {
    setLoading(true);
    setError('');
    const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== ''));
    api
      .get('/listings', { params: clean })
      .then((res) => setData(res.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    search(initial);
  }, []);

  const set = (key) => (e) => setFilters({ ...filters, [key]: e.target.value, page: 1 });
  
  const handlePage = (newPage) => {
    const newFilters = { ...filters, page: newPage };
    setFilters(newFilters);
    search(newFilters);
  };

  const submit = (e) => {
    e.preventDefault();
    search({ ...filters, page: 1 });
    setFilters((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <section>
      <div className="hero">
        <h1>Find your next nest.</h1>
        <p className="muted">Homestays, havelis, villas and hostels across India.</p>
        <form className="search-bar card" onSubmit={submit}>
          <input placeholder="Where to? (e.g. Jaipur)" value={filters.city} onChange={set('city')} />
          <select value={filters.type} onChange={set('type')}>
            <option value="">Any type</option>
            {STAY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <input type="number" min="1" placeholder="Guests" value={filters.guests} onChange={set('guests')} />
          <input type="number" min="0" placeholder="Max ₹/night" value={filters.maxPrice} onChange={set('maxPrice')} />
          <select value={filters.sort} onChange={set('sort')}>
            <option value="">Sort by: Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
          <button className="btn">Search</button>
        </form>
      </div>

      {error && <p className="error">{error}</p>}
      {loading ? (
        <Loader />
      ) : data.listings.length === 0 ? (
        <p className="muted">No stays match your search.</p>
      ) : (
        <>
          <div className="grid">
            {data.listings.map((l) => <ListingCard key={l._id} listing={l} />)}
          </div>
          {data.pages > 1 && (
            <div className="row-between" style={{ marginTop: '24px', justifyContent: 'center', gap: '16px' }}>
              <button 
                className="btn btn-ghost" 
                disabled={data.page === 1} 
                onClick={() => handlePage(data.page - 1)}
              >
                Previous
              </button>
              <span className="muted">Page {data.page} of {data.pages}</span>
              <button 
                className="btn btn-ghost" 
                disabled={data.page === data.pages} 
                onClick={() => handlePage(data.page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
