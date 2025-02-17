import React, { PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';
import { FormattedDate, FormattedMessage } from 'react-intl';

import { elementFromClass } from '../../lib/react-utils';

import { useDrawerActionsContainer } from '../Drawer';
import PayoutMethodData from '../expenses/PayoutMethodData';
import LinkCollective from '../LinkCollective';
import LocationAddress from '../LocationAddress';
import { H4 } from '../Text';
import { Button } from '../ui/Button';

import { VendorFieldsFragment } from './queries';

type VendorDetailsProps = {
  vendor: VendorFieldsFragment;
  onCancel: () => void;
  editVendor: () => void;
};

const SectionTitle = elementFromClass('p', 'text-md font-bold text-slate-800 mb-2');
export const VendorContactTag = elementFromClass(
  'div',
  'text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-full w-max flex gap-1',
);

const HeaderInfo = ({ children }: PropsWithChildren) => (
  <div>
    <p className="text-xs text-slate-700">{children[0]}</p>
    <p className="mt-2 text-sm">{children[1]}</p>
  </div>
);

const VendorInfo = ({ children }: PropsWithChildren) => (
  <div className="mt-4 flex flex-col rounded-md bg-slate-50 px-4 py-3">
    <SectionTitle>{children[0]}</SectionTitle>
    <div className="text-sm text-slate-700">{children[1]}</div>
  </div>
);

const VendorDetails = ({ vendor, onCancel, editVendor }: VendorDetailsProps) => {
  const drawerActionsContainer = useDrawerActionsContainer();

  const { contact, notes, taxType, taxId } = vendor.vendorInfo || {};
  const payoutMethod = vendor.payoutMethods?.[0];
  return (
    <div>
      <H4 mb={32}>
        <FormattedMessage defaultMessage="Vendor's Detail" />
      </H4>
      <SectionTitle>{vendor.name}</SectionTitle>
      <div className="mt-4 flex gap-8">
        <HeaderInfo>
          <FormattedMessage id="agreement.createdOn" defaultMessage="Created on" />
          <FormattedDate value={vendor.createdAt} dateStyle="medium" />
        </HeaderInfo>
        <HeaderInfo>
          <FormattedMessage id="Agreement.createdBy" defaultMessage="Created by" />
          <React.Fragment>
            <LinkCollective collective={vendor.createdByAccount}>{vendor.createdByAccount.name}</LinkCollective>
          </React.Fragment>
        </HeaderInfo>
      </div>
      {contact && (
        <div className="mt-4 flex flex-col">
          <SectionTitle>
            <FormattedMessage defaultMessage="Vendor Contact" />
          </SectionTitle>
          <VendorContactTag>
            {contact.name}
            {contact.email && (
              <a href={`mailto:${contact.email}`} className="font-normal">
                {contact.email}
              </a>
            )}
          </VendorContactTag>
        </div>
      )}
      <div className="grid grid-cols-3 gap-4">
        {taxType && (
          <VendorInfo>
            <FormattedMessage defaultMessage="Company Identifier" />
            <React.Fragment>
              {taxType}: {taxId}
            </React.Fragment>
          </VendorInfo>
        )}
        {vendor.location && (
          <VendorInfo>
            <FormattedMessage defaultMessage="Mailing Address" />
            <LocationAddress location={vendor.location} />
          </VendorInfo>
        )}
        {payoutMethod && (
          <VendorInfo>
            <FormattedMessage id="SecurityScope.PayoutMethod" defaultMessage="Payout Method" />
            <PayoutMethodData payoutMethod={payoutMethod} />
          </VendorInfo>
        )}
      </div>
      {notes && (
        <div className="mt-4 flex flex-col">
          <SectionTitle>
            <FormattedMessage id="expense.notes" defaultMessage="Notes" />
          </SectionTitle>
          <div>{notes}</div>
        </div>
      )}
      {drawerActionsContainer &&
        createPortal(
          <div className="flex flex-grow justify-between gap-2">
            <Button onClick={onCancel} variant="outline" className="rounded-full">
              <FormattedMessage id="actions.cancel" defaultMessage="Cancel" />
            </Button>
            <Button onClick={editVendor} className="rounded-full">
              <FormattedMessage defaultMessage="Edit Vendor" />
            </Button>
          </div>,
          drawerActionsContainer,
        )}
    </div>
  );
};

export default VendorDetails;
