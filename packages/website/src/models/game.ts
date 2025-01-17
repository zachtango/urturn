import axios from 'axios';
import { Game } from '@urturn/types-common';

export interface GameReqBody {
  name: string
  description: string
  githubURL: string
  commitSHA: string
}

export interface GamesQuery {
  creator?: string
  searchText?: string
  limit?: number
}

export const createGame = async (game: GameReqBody): Promise<Game> => {
  const res = await axios.post('game', game);
  return res.data.game as Game;
};

export const updateGame = async (gameId: string, game: GameReqBody): Promise<Game> => {
  const res = await axios.put(`game/${gameId}`, game);
  return res.data.game as Game;
};

export const deleteGame = async (gameId: string): Promise<void> => {
  await axios.delete(`game/${gameId}`);
};

export const getGame = async (gameId: string): Promise<Game> => {
  const res = await axios.get(`game/${gameId}`);
  return res.data.game;
};

export const getGames = async (queryMap: GamesQuery = {}): Promise<Game[]> => {
  const res = await axios.get('game', {
    params: {
      skip: 0,
      limit: 10,
      ...queryMap,
    },
  });
  return res.data.games;
};
