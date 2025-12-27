[
{"course":"python","question":"What happens if a dictionary key’s hash changes?","answer":"The key becomes unreachable.","reasoning":"Dictionaries rely on stable hashes to locate keys."},
{"course":"python","question":"Why are tuples hashable but lists are not?","answer":"Tuples are immutable.","reasoning":"Immutability guarantees the hash will not change."},
{"course":"python","question":"Can a tuple containing a list be hashed?","answer":"No.","reasoning":"All elements inside a tuple must be hashable."},
{"course":"python","question":"What is the purpose of hashing in sets?","answer":"To ensure uniqueness.","reasoning":"Hashes allow fast membership checks."},
{"course":"python","question":"How does Python handle hash collisions?","answer":"With probing.","reasoning":"Python resolves collisions internally in hash tables."},

{"course":"python","question":"What is open addressing?","answer":"A collision resolution strategy.","reasoning":"Python uses probing to find another slot."},
{"course":"python","question":"Does Python expose collision handling to users?","answer":"No.","reasoning":"Collision handling is managed internally."},
{"course":"python","question":"Is hash order guaranteed in dictionaries?","answer":"No, hash order is not.","reasoning":"Insertion order is preserved, not hash order."},
{"course":"python","question":"Do dictionaries store keys in hash order?","answer":"No.","reasoning":"They store keys in insertion order since Python 3.7."},
{"course":"python","question":"Is dictionary lookup faster than list search?","answer":"Yes.","reasoning":"Hash lookup is O(1) versus list search O(n)."},

{"course":"python","question":"Why is hashing useful for caching?","answer":"It enables fast key lookup.","reasoning":"Cached results are retrieved instantly."},
{"course":"python","question":"What decorator uses hashing internally?","answer":"lru_cache.","reasoning":"It hashes function arguments to cache results."},
{"course":"python","question":"Why must cached function arguments be hashable?","answer":"They are used as dictionary keys.","reasoning":"Unhashable arguments cannot be cached."},
{"course":"python","question":"Can floats be hashed?","answer":"Yes.","reasoning":"Floats are immutable and hashable."},
{"course":"python","question":"Can NaN be hashed?","answer":"Yes, but it behaves oddly.","reasoning":"NaN is not equal to itself, which affects comparisons."},

{"course":"python","question":"What is hash consistency?","answer":"Same object gives same hash.","reasoning":"Consistency ensures reliable lookups."},
{"course":"python","question":"Does Python guarantee unique hashes?","answer":"No.","reasoning":"Different objects can share a hash."},
{"course":"python","question":"What is a perfect hash?","answer":"A hash with no collisions.","reasoning":"Perfect hashes are rare and dataset-specific."},
{"course":"python","question":"Why doesn’t Python use perfect hashing?","answer":"It is impractical.","reasoning":"Dynamic data makes perfect hashing unrealistic."},
{"course":"python","question":"What is the hash of an empty tuple?","answer":"A constant value.","reasoning":"Empty tuples are immutable and hashable."},

{"course":"python","question":"What happens if you try to hash a list?","answer":"A TypeError is raised.","reasoning":"Lists are mutable and unhashable."},
{"course":"python","question":"Can frozenset be used as a dictionary key?","answer":"Yes.","reasoning":"frozenset is immutable and hashable."},
{"course":"python","question":"Why is frozenset useful?","answer":"Immutable set behavior.","reasoning":"Allows set-like data as keys."},
{"course":"python","question":"What does hash stability mean?","answer":"Hash does not change over time.","reasoning":"Required for correct key access."},
{"course":"python","question":"Is hashing deterministic within one program run?","answer":"Yes.","reasoning":"Hashes remain stable during execution."},

{"course":"python","question":"Why does Python randomize string hashes?","answer":"To prevent hash attacks.","reasoning":"It protects against denial-of-service attacks."},
{"course":"python","question":"Can hash randomization be disabled?","answer":"Yes, via environment variable.","reasoning":"PYTHONHASHSEED controls this behavior."},
{"course":"python","question":"Is hash used in equality checks?","answer":"Indirectly.","reasoning":"Hashes narrow lookup before equality check."},
{"course":"python","question":"What is the relationship between hash and equality?","answer":"Hash groups, equality confirms.","reasoning":"Hash finds candidates, eq verifies match."},
{"course":"python","question":"Why must hash be fast to compute?","answer":"It affects performance.","reasoning":"Hashes are computed frequently."},

{"course":"python","question":"What happens during dictionary resizing?","answer":"All keys are rehashed.","reasoning":"Rehashing redistributes keys."},
{"course":"python","question":"What triggers dictionary resizing?","answer":"High load factor.","reasoning":"Too many entries reduce performance."},
{"course":"python","question":"Is hashing used in membership testing?","answer":"Yes.","reasoning":"The in keyword uses hashing for sets and dicts."},
{"course":"python","question":"Why is set membership fast?","answer":"It uses hashing.","reasoning":"Hash lookup avoids linear search."},
{"course":"python","question":"What is the main danger of bad hash functions?","answer":"Performance degradation.","reasoning":"Poor hashes cause many collisions."},

{"course":"python","question":"Does Python allow negative hash values?","answer":"Yes.","reasoning":"Hash values are signed integers."},
{"course":"python","question":"Are hash values portable across machines?","answer":"No.","reasoning":"Hash implementations may differ."},
{"course":"python","question":"What Python concept depends on hashing most heavily?","answer":"Dictionaries.","reasoning":"They are built entirely on hash tables."},
{"course":"python","question":"Why is hashing fundamental to Python design?","answer":"It enables fast data access.","reasoning":"Core data structures rely on hashing."},
{"course":"python","question":"What breaks if hashes are inconsistent?","answer":"Key-based lookups.","reasoning":"Incorrect hashes prevent proper retrieval."}
]