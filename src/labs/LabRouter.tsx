import React from 'react';
import { Lab1_1, Lab1_2, Lab1_3 } from './Chapter1Labs';
import { Lab2_1, Lab2_2, Lab2_3, Lab2_4 } from './Chapter2Labs';
import { Lab3_1, Lab3_2, Lab3_3, Lab3_4 } from './Chapter3LabsA';
import { Lab3_5, Lab3_6, Lab3_7, Lab3_8 } from './Chapter3LabsB';
import { Lab4_1, Lab4_2, Lab4_3 } from './Chapter4LabsA';
import { Lab4_4, Lab4_5, Lab4_6 } from './Chapter4LabsB';

const labRegistry: Record<string, React.FC> = {
  '1-1': Lab1_1,
  '1-2': Lab1_2,
  '1-3': Lab1_3,
  '2-1': Lab2_1,
  '2-2': Lab2_2,
  '2-3': Lab2_3,
  '2-4': Lab2_4,
  '3-1': Lab3_1,
  '3-2': Lab3_2,
  '3-3': Lab3_3,
  '3-4': Lab3_4,
  '3-5': Lab3_5,
  '3-6': Lab3_6,
  '3-7': Lab3_7,
  '3-8': Lab3_8,
  '4-1': Lab4_1,
  '4-2': Lab4_2,
  '4-3': Lab4_3,
  '4-4': Lab4_4,
  '4-5': Lab4_5,
  '4-6': Lab4_6,
};

export const LabRouter: React.FC<{ subsectionId: string }> = ({ subsectionId }) => {
  const LabComponent = labRegistry[subsectionId];
  if (!LabComponent) return null;
  return <LabComponent key={subsectionId} />;
};
