// @flow
import React from 'react';
import { storiesOf, action } from '@storybook/react';
import { linkTo } from '@storybook/addon-links';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import faker from 'faker';
import startCase from 'lodash/startCase';

// Assets and helpers
import StoryLayout from './support/StoryLayout';
import StoryProvider from './support/StoryProvider';
import StoryDecorator from './support/StoryDecorator';
import { generateTransaction, generateAddres, promise } from './support/utils';
import { formattedWalletAmount } from '../../source/renderer/app/utils/ada/formatters';
import { transactionTypes } from '../../source/renderer/app/domains/WalletTransaction';
import WalletWithNavigation from '../../source/renderer/app/components/wallet/layouts/WalletWithNavigation';

// Screens
import WalletSummary from '../../source/renderer/app/components/wallet/summary/WalletSummary';
import WalletSendForm from '../../source/renderer/app/components/wallet/WalletSendForm';
import WalletReceive from '../../source/renderer/app/components/wallet/WalletReceive';
import WalletTransactionsList from '../../source/renderer/app/components/wallet/transactions/WalletTransactionsList';
import WalletSettings from '../../source/renderer/app/components/wallet/WalletSettings';
import { assuranceModeOptions } from '../../source/renderer/app/types/transactionAssuranceTypes';
import ChangeWalletPasswordDialog from '../../source/renderer/app/components/wallet/settings/ChangeWalletPasswordDialog';
import DeleteWalletConfirmationDialog from '../../source/renderer/app/components/wallet/settings/DeleteWalletConfirmationDialog';

storiesOf('WalletScreens', module)

  .addDecorator((story, context) => {

    const storyWithKnobs = withKnobs(story, context);

    return (
      <StoryDecorator>
        <StoryProvider>
          <StoryLayout
            activeSidebarCategory="/wallets"
            storyName={context.story}
          >
            {
              context.story !== 'Empty'
                ? (
                  <WalletWithNavigation
                    isActiveScreen={item => item === context.story.toLocaleLowerCase()}
                    onWalletNavItemClick={linkTo('WalletScreens', item => startCase(item))}
                  >
                    {storyWithKnobs}
                  </WalletWithNavigation>
                )
                : storyWithKnobs
            }
          </StoryLayout>
        </StoryProvider>
      </StoryDecorator>
    );
  })

  // ====== Stories ======

  .add('Empty', () => false)

  .add('Wallet Navigation', () => (
    <div>&nbsp;</div>
  ))

  .add('Summary', () => (
    <WalletSummary
      walletName={text('Wallet Name', 'Wallet name')}
      amount={text('Amount', '45119903750165.23')}
      pendingAmount={{
        incoming: new BigNumber(number('Incoming', 1)),
        outgoing: new BigNumber(number('Outgoing', 2)),
        total: new BigNumber(3)
      }}
      numberOfTransactions={number('Number of transactions', 20303585)}
      isLoadingTransactions={boolean('isLoadingTransactions', false)}
    />
  ))

  .add('Send', () => (
    <WalletSendForm
      currencyUnit="Ada"
      currencyMaxFractionalDigits={6}
      currencyMaxIntegerDigits={11}
      validateAmount={promise(true)}
      calculateTransactionFee={promise(true)}
      addressValidator={() => {}}
      openDialogAction={() => {}}
      isDialogOpen={() => boolean('hasDialog', false)}
      isRestoreActive={boolean('isRestoreActive', false)}
    />
  ))

  .add('Receive', () => (
    <WalletReceive
      walletAddress={text('Wallet address', '5628aab8ac98c963e4a2e8cfce5aa1cbd4384fe2f9a0f3c5f791bfb83a5e02ds')}
      isWalletAddressUsed={boolean('isWalletAddressUsed', false)}
      walletAddresses={[
        ...Array.from(Array(number('Addresses', 1))).map(() => generateAddres()),
        ...Array.from(Array(number('Addresses (used)', 1))).map(() => generateAddres(true)),
      ]}
      onGenerateAddress={() => {}}
      onCopyAddress={() => {}}
      isSidebarExpanded
      walletHasPassword={boolean('walletHasPassword', false)}
      isSubmitting={boolean('isSubmitting', false)}
    />
  ))

  .add('Transactions', () => (
    <WalletTransactionsList
      transactions={[
        ...Array.from(Array(number('Transactions Sent', 1))).map((x, i) =>
          generateTransaction(
            transactionTypes.EXPEND,
            moment().subtract(i, 'days').toDate(),
            new BigNumber(faker.random.number(5))
          )
        ),
        ...Array.from(Array(number('Transactions Received', 1))).map((x, i) =>
          generateTransaction(
            transactionTypes.INCOME,
            moment().subtract(i, 'days').toDate(),
            new BigNumber(faker.random.number(5))
          )
        ),
      ]}
      isLoadingTransactions={false}
      hasMoreToLoad={false}
      assuranceMode={{ low: 1, medium: 2 }}
      walletId="test-wallet"
      formattedWalletAmount={formattedWalletAmount}
    />
  ))

  .add('Settings', () => (
    <WalletSettings
      activeField={null}
      assuranceLevels={[
        {
          value: assuranceModeOptions.NORMAL,
          label: {
            id: 'global.assuranceLevel.normal',
            defaultMessage: '!!!Normal',
            description: ''
          }
        },
        {
          value: assuranceModeOptions.STRICT,
          label: {
            id: 'global.assuranceLevel.strict',
            defaultMessage: '!!!Strict',
            description: ''
          }
        }
      ]}
      isDialogOpen={(dialog) => {
        if (dialog === ChangeWalletPasswordDialog) {
          return boolean('showChangeWalletPasswordDialog', false);
        }
        if (dialog === DeleteWalletConfirmationDialog) {
          return boolean('showDeleteWalletConfirmationDialog', false);
        }
      }}
      isInvalid={false}
      isSubmitting={false}
      isWalletPasswordSet={boolean('isWalletPasswordSet', false)}
      lastUpdatedField={null}
      nameValidator={() => true}
      onCancelEditing={() => {}}
      onFieldValueChange={() => {}}
      onStartEditing={() => {}}
      onStopEditing={() => {}}
      openDialogAction={() => {}}
      walletAssurance={assuranceModeOptions.NORMAL}
      walletName={text('Wallet Name', 'Wallet Name')}
      walletPasswordUpdateDate={moment().subtract(1, 'month').toDate()}
      changeWalletPasswordDialog={
        <ChangeWalletPasswordDialog
          currentPasswordValue="current"
          newPasswordValue="new"
          repeatedPasswordValue="new"
          isWalletPasswordSet={boolean('isWalletPasswordSet', false)}
          onSave={action('ChangeWalletPasswordDialog::onSave')}
          onCancel={action('ChangeWalletPasswordDialog::onCancel')}
          onPasswordSwitchToggle={action('ChangeWalletPasswordDialog::onPasswordSwitchToggle')}
          onDataChange={action('ChangeWalletPasswordDialog::onDataChange')}
          isSubmitting={boolean('ChangeWalletPasswordDialog::isSubmitting', false)}
          error={null}
        />
      }
      deleteWalletDialogContainer={
        <DeleteWalletConfirmationDialog
          walletName={text('DeleteWalletConfirmationDialog: Wallet Name', 'Wallet To Delete')}
          hasWalletFunds={boolean('hasWalletFunds', false)}
          countdownFn={() => number('Delete Wallet Countdown', 9)}
          isBackupNoticeAccepted={boolean('isBackupNoticeAccepted', false)}
          onAcceptBackupNotice={action('DeleteWalletConfirmationDialog::onAcceptBackupNotice')}
          onContinue={action('DeleteWalletConfirmationDialog::onContinue')}
          onCancel={action('DeleteWalletConfirmationDialog::onCancel')}
          confirmationValue={text('Delete Wallet Confirmation Value')}
          onConfirmationValueChange={action('DeleteWalletConfirmationDialog::onConfirmationValueChange')}
          isSubmitting={boolean('DeleteWalletConfirmationDialog::isSubmitting', false)}
        />
      }
    />
  ));
