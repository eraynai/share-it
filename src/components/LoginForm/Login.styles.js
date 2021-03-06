import styled from 'styled-components';

export const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 2rem;
`;

export const Input = styled.input.attrs((props) => ({
	// we can define static props
	type: 'text',

	// or we can define dynamic ones
	size: props.size || '1em',
}))`
	color: palevioletred;
	font-size: 1em;
	border: 2px solid palevioletred;
	border-radius: 3px;

	/* here we use the dynamically computed prop */
	margin: ${(props) => props.size};
	padding: ${(props) => props.size};
`;
