export interface Player {
    name: string;
    playedToday: boolean;
    isPermMember: boolean;
    isTempMember: boolean;
    isOtherMember: boolean;
    pay: number,
    refund: number,
  }

export const PlayersList: Player[] = [
  {
    name: 'Manoj',
    playedToday: false,
    isPermMember: true,
    isTempMember: false,
    isOtherMember: false,
    pay: 0,
    refund: 0
  },
  {
    name: 'Chinmaya',
    playedToday: false,
    isPermMember: true,
    isTempMember: false,
    isOtherMember: false,
    pay: 0,
    refund: 0
  },
  {
    name: 'Satya',
    playedToday: false,
    isPermMember: true,
    isTempMember: false,
    isOtherMember: false,
    pay: 0,
    refund: 0
  },
  {
    name: 'Paramesh',
    playedToday: false,
    isPermMember: true,
    isTempMember: false,
    isOtherMember: false,
    pay: 0,
    refund: 0
  },
  {
    name: 'Harish',
    playedToday: false,
    isPermMember: false,
    isTempMember: true,
    isOtherMember: false,
    pay: 0,
    refund: 0
  }
]

export interface ShuttleUsedType {
  name: string;
  value: string
}