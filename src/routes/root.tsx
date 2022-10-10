import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Header from '../Header';

const Root = () => {
	return (
		<>
			<Header />
			<Box as="main" pt="20" pb="10" px="5" height="100vh">
				<Suspense fallback={<div>Loading...</div>}>
					<Outlet />
				</Suspense>
			</Box>
		</>
	);
};

export default Root;
