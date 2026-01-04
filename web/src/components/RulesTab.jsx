import React from 'react';

export default function RulesTab({ setActiveTab }) {
    console.log("RulesTab simplified render");
    return (
        <div className="p-8 text-white bg-red-900">
            <h1 className="text-2xl">TEST RÈGLEMENT</h1>
            <p>Si vous voyez ceci, le composant se charge correctement.</p>
            <button onClick={() => setActiveTab('character')} className="bg-stone-800 p-2 mt-4 rounded">Retour</button>
        </div>
    );
}
