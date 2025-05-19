/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import {z} from 'zod'

export const isValidEmail = z.string().email().min(7).max(40);

