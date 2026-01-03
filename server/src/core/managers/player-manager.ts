import { Player } from "../player";

export type FindPlayerParams = {
  token?: string;
  id?: string;
  name?: string;
  socketId?: string;
};

class PlayerManager {
  private static instance: PlayerManager;
  private players = new Map<string, Player>();

  private constructor() { }

  public static getInstance() {
    if (!this.instance) this.instance = new PlayerManager();
    return this.instance;
  }

  public addPlayer(player: Player) {
    this.players.set(player.id, player);
  }

  public removePlayer(playerId: string) {
    this.players.delete(playerId);
  }

  public getPlayer(playerId: string) {
    return this.players.get(playerId) ?? null;
  }

  public getSocket(playerId: string) {
    return this.players.get(playerId)?.getSocket() ?? null;
  }

  public getAllPlayers() {
    return Array.from(this.players.values());
  }

  public findPlayer(params: FindPlayerParams): Player | null {
    const { id, token, name, socketId } = params;

    if (id) return this.findPlayerById(id);
    if (token) return this.findPlayerByToken(token);
    if (name) return this.findPlayerByName(name);
    if (socketId) return this.findPlayerBySocketId(socketId);

    return null;
  }

  private findPlayerBySocketId(socketId: string) {
    for (const player of this.players.values()) {
      if (player.getSocket().id === socketId) return player;
    }
    return null;

  }

  private findPlayerById(id: string): Player | null {
    return this.players.get(id) ?? null;
  }

  private findPlayerByToken(token: string): Player | null {
    for (const player of this.players.values()) {
      if (player.token === token) return player;
    }
    return null;
  }

  private findPlayerByName(name: string): Player | null {
    for (const player of this.players.values()) {
      if (player.name === name) return player;
    }
    return null;
  }
}

export default PlayerManager;

