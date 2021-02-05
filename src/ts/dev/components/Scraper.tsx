import { h, render, Fragment } from 'preact';
import { useState } from 'preact/hooks';
import { defaultTo, path, pipe, tap, tryCatch } from 'ramda';
import { useStorage } from '../../hooks/useStorage';
import { inspect } from '../../utils/putils';
const Scraper = () => {
  const [auth, setAuth] = useStorage('auth', {});
  const [authInput, setAuthInput] = useState('');
  const _auth = `{"name": "credentials","authorization":"Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA","x-csrf-token":"5dfb02622fec9056f3e219182fd373eee0f6ca57f8a95d94a2de8ed9b75a50499b527246fd75175913313787770657af4d6d312c1fb2b6feff77a9299b1d6080f1d71ed7cac1bc24532b1fb3aef921be"}`;

  const handleChange = (event) => {
    setAuthInput(event.target.value);
  };

  const submitAuth = () => {
    try {
      const authParsed = JSON.parse(authInput);
      console.log(`parsed auth`, { authInput, authParsed });
      setAuth(authParsed);
    } catch {
      console.log(`couldn't parse auth`, { authInput });
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    submitAuth();
  };

  return (
    <div id="Scraper" class="m-4 bg-gray-100">
      <div class="title">Scraper</div>
      <div>
        <form onSubmit={onSubmit}>
          <label>
            Auth:
            <textarea
              class="bg-gray-200 w-64 h-32 m-4"
              value={authInput}
              onChange={handleChange}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    </div>
  );
};
export default Scraper;
