import { customAlphabet } from 'nanoid'

export const generateUID = (size = 32): any => {
    return customAlphabet('0123456789abcdefghijklmnopqrstvwxyz', size * 2)()
}

export const generateMachine = (name: string): string => {
    return name
        .replace(/^\s+|\s+$/g, '')
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '')
}
