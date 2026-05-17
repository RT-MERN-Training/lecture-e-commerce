import { Box, Title } from '@mantine/core';

import Tabs from '../ui/Tabs/Tabs';

const HomeInfoSection = () => {
  return (
    <Box mb="xl">
      <Title order={2} mb="md">
        🛍️ Store Information
      </Title>
      <Tabs defaultValue="campaigns">
        <Tabs.List>
          <Tabs.Tab value="campaigns">🔥 Special Offers</Tabs.Tab>
          <Tabs.Tab value="shipping">📦 Shipping & Returns</Tabs.Tab>
          <Tabs.Tab value="faq">💬 FAQ</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="campaigns">
          <div>
            <h3>Summer Sale is ON!</h3>
            <p>
              Get up to 30% off on all Audio devices and 15% off on selected Laptops. Use code{' '}
              <strong>SUMMER30</strong> at checkout.
            </p>
            <p style={{ color: '#868e96', fontSize: '14px' }}>* Valid until end of the month.</p>
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="shipping">
          <div style={{ lineHeight: '1.6' }}>
            <h4>Free Shipping</h4>
            <p>We offer free standard shipping on all orders over $99 within the continental US.</p>
            <h4>30-Day Returns</h4>
            <p>
              Not satisfied? Return your item within 30 days of delivery for a full refund. No
              questions asked.
            </p>
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="faq">
          <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
            <li>
              <strong>Do you offer international shipping?</strong> Yes, we ship to over 50
              countries worldwide.
            </li>
            <li>
              <strong>Are these products authentic?</strong> Absolutely. We are an authorized
              retailer for all brands we carry.
            </li>
            <li>
              <strong>How long does the warranty last?</strong> Most electronics come with a
              standard 1-year manufacturer warranty.
            </li>
          </ul>
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
};

export default HomeInfoSection;
