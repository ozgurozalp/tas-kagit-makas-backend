import { v4 as uuidv4 } from 'uuid';

export default function () {
    return uuidv4().split('-')[0];
}
