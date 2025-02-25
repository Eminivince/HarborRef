import Aside from "../components/Aside";
import InnerNav from "../components/InnerNav";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="flex min-h-screen pb-20 bg-gray-300 text-white">
      <Aside />
      <div className="pt-6 px-4 md:px-10 w-full">
        <InnerNav user={user || undefined} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-black w-full md:w-[80%] lg:w-[70%] mx-auto pt-10 md:pt-20 px-4">
          <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              1. Information We Collect
            </h2>
            <p className="mb-4">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Account information (username, email address)</li>
              <li>Wallet addresses and transaction data</li>
              <li>Staking and reward information</li>
              <li>Referral data and network connections</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              2. How We Use Your Information
            </h2>
            <p className="mb-4">We use the collected information for:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Processing your transactions and stakes</li>
              <li>Managing your account and providing customer support</li>
              <li>Calculating and distributing rewards</li>
              <li>Improving our services and user experience</li>
              <li>Sending important updates about our platform</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Data Security</h2>
            <p className="mb-4">
              We implement appropriate security measures to protect your
              personal information against unauthorized access, alteration,
              disclosure, or destruction. However, no method of transmission
              over the Internet is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              4. Third-Party Services
            </h2>
            <p className="mb-4">
              Our service integrates with blockchain networks and may use
              third-party services for specific functionalities. These services
              have their own privacy policies and terms of service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              6. Updates to This Policy
            </h2>
            <p className="mb-4">
              We may update this privacy policy from time to time. We will
              notify you of any changes by posting the new privacy policy on
              this page and updating the effective date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this privacy policy, please
              contact us at support@harbor.com
            </p>
          </section>

          <p className="text-sm text-gray-600 mt-8">
            Last updated: January 2024
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
