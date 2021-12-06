import exitCodes from './exitCodes';

export default function handleTestError(error) {
    console.log(error);
    process.exit(exitCodes.failure);
}