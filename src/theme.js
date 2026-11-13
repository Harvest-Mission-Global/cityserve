import { extendTheme } from '@chakra-ui/react';
import '@fontsource/antonio';
import '@fontsource/manrope';

const theme = extendTheme({
	colors: {
		brand: {
			navy: '#183B5D',
			blue: '#1769B8',
			logoBlue: '#0053A4',
			lightBlue: '#DAEDFA',
			skyBlue: '#99C6E6',
			cream: '#F9EEE3',
			sand: '#E0CEBB',
			offWhite: '#F8F8F8',
		},
	},
	fonts: {
		heading: `'Antonio', sans-serif`,
		body: `'Manrope', sans-serif`,
	},
});

export default theme;
