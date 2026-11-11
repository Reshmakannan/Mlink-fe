import React from 'react';
import '../Style/WorkflowProgress.css';

const FLOW = ['Choose template', 'Add links', 'Customize', 'Preview & save', 'Publish'];

export default function WorkflowProgress({ activeStep }) {
  return (
    <ol className="tpls__flow" aria-label={`Progress: step ${activeStep + 1} of ${FLOW.length}`}>
      {FLOW.map((label, index) => (
        <li
          key={label}
          className={`tpls__flow-item${index === activeStep ? ' tpls__flow-item--on' : ''}${
            index < activeStep ? ' tpls__flow-item--done' : ''
          }`}
          aria-current={index === activeStep ? 'step' : undefined}
        >
          <span className="tpls__flow-dot" aria-hidden="true">
            {index < activeStep ? '✓' : index + 1}
          </span>
          <span className="tpls__flow-label">{label}</span>
        </li>
      ))}
    </ol>
  );
}
