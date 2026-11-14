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
	radii: {
		button: '0.625rem',
	},
	letterSpacings: {
		label: '0.12rem',
	},
	textStyles: {
		sectionTitle: {
			fontFamily: 'heading',
			fontWeight: 700,
			fontSize: { base: '1.75rem', md: '2.25rem' },
			textTransform: 'uppercase',
		},
		body: {
			fontFamily: 'body',
			fontWeight: 400,
			fontSize: { base: '0.875rem', md: '1.25rem' },
		},
		label: {
			fontFamily: 'body',
			fontWeight: 800,
			fontSize: { base: '0.8rem', lg: '1rem' },
			letterSpacing: 'label',
			textTransform: 'uppercase',
		},
	},
});

export default theme;
