import React from 'react';
import InnerModalForm from './ModalForm';
import { RopeActionResult, STOP } from '../rope';
import { FormProps } from '../form';
import { ModalProps } from 'antd/lib/modal';
import { DrawerProps } from 'antd/lib/drawer';

export interface RefModalProps {
  type: 'modal' | 'drawer';
}

export interface ModalFormProps extends FormProps {
  title: string | React.ReactElement;
  width?: number;
  props?: ModalProps | DrawerProps;
}

const RefModalForm: React.FC<RefModalProps> = ({ type }, ref) => {
  const [resetCount, setResetCount] = React.useState(0);
  const [visible, setVisible] = React.useState<boolean>(false);
  const modalRef = React.useRef<any>({});
  const modal = modalRef.current;

  modal.show = (props: ModalFormProps) => {
    return new Promise((resolve, reject) => {
      setVisible(true);
      setResetCount(resetCount + 1);
      modal.props = props;

      modal.close = (result: RopeActionResult | any) => {
        setVisible(false);
        // 终止调用链
        if (result === STOP) {
          reject(STOP);
        } else {
          resolve(result);
        }
      };
    });
  };

  React.useImperativeHandle(ref, () => {
    return {
      show: modal.show,
    };
  });

  return React.createElement(InnerModalForm, {
    key: resetCount,
    visible,
    modal,
    isDrawer: type === 'drawer',
  });
};

const ModalForm = React.forwardRef(RefModalForm);

export default ModalForm;
